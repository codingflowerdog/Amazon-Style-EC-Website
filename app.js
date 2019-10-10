var http = require('http')
var express = require('express')

var app = express();
var router = express.Router();

var env = require('./env')
var config = require('./config')
var route_info = require('./routes/router_loader')
var database = require('./databases/database')

config.init(app,env)
route_info.init(app,router);

database.init(app,env)

http.createServer(app).listen(app.get('port'),function(){
    console.log('amazon 서버 시작됨')
})