var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/users', require('./users'));
router.use('/chat', require('./Chat'));

module.exports = router;
