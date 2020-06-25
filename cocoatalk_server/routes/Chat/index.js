var express = require('express')
var app = express();
var socketio = require('socket.io');

var server = app.listen(3001, () => {
    console.log('Listening at port number 3001')
})

var io = socketio.listen(server) // 이 과정을 통해 express 서버를 socket io 서버로 업그레이드 시킴.

var whoIsOn = []; // 이 배열은 누가 chatroom에 있는지를 보여줌

// 이 서버에서는 어떤 클라이언트가 connection event를 발생시키는 것인지 듣고 있음
// callback으로 넘겨지는 socket에는 현재 클라이언트와 연결되어있는 socket 관련 정보가 다 들어있음
io.on('connection', function(socket){
    var nickname = ''

    //클라이언트가 login이라는 이벤트를 발생시키면 
    //어떤 콜백함수를 작동시킬 것인지 설정하는 부분
    socket.on('login', function(data){
        console.log(`${data} 님이 채팅방에 입장하셨습니다! -----------------`)
        whoIsOn.push(data)
        nickname = data

        //아래와 같이 작성하면 그냥 String으로 넘어가므로 쉽게 파싱 가능
        //그냥 넘길 경우 JSONArray로 넘어가서 복잡해짐
        var whoIsOnJson = `${whoIsOn}`
        console.log(whoIsOnJson)

        //io.emit과 socket.emit의 다른점 : io는 서버에 연결된 모든 소켓에 보내는 것
        //socket은 현재 연결된 소켓에만 보내는것
        io.emit('newUser', whoIsOnJson)
    })

    socket.on('say', function(data){
        console.log(`${nickname} : ${data}`)

        socket.emit('myMsg', data)
        socket.broadcast.emit('newMsg', data)
    })

    socket.on('disconnect', function(){
        console.log(`${nickname} 님이 채팅방을 나가셨습니다 ----------------`)
    })

    socket.on('logout', function(){

        // whoIsOn 배열에서 해당 유저 삭제
        //array.splice(idx,n) : array의 인덱스가 idx인 곳부터 n개의 원소를 삭제
        whoIsOn.splice(whoIsOn.indexOf(nickname), 1); 
        var data = {
            whoIsOn : whoIsOn,
            disconnected : nickname
        }
        socket.emit('logout', data)
    })
})