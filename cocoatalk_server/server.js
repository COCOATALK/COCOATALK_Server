var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var socket = require('socket.io');
var io = socket(server);

var port = 3001;

app.use('/', function(req, resp) {
    resp.sendFile(__dirname + '/chat.html');
});

io.on('connection', function(socket) {
    console.log('User Join');
});

server.listen(port, function() {
    console.log('Server On !');
});
