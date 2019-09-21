var path = require('path');
var static = require('serve-static');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var expressErrorHandler = require('express-error-handler');

var init = function(app,env){
    app.use(static(path.join(__dirname,'/views')));
    app.set('port',process.env.PORT || env.server_port);
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(expressSession({
        key:'my key',
        secret:'secret key',
        resave:false,
        saveUninitialized:true
    }));

    app.use('/img',static(path.join(__dirname,'/img')));
    app.use('/css',static(path.join(__dirname,'/css')));
    app.set('views',__dirname + '/views');
    app.set('view engine','ejs');
    app.engine('html',require('ejs').renderFile);

}

module.exports.init = init;
