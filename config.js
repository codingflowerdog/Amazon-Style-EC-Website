var path = require('path');
var static = require('serve-static');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var fs = require('fs');
var fileUpload = require('express-fileupload')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

var upload = multer({ storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, + Date.now() + '_' + file.originalname)
        }
    }) })
//var upload = multer({ dest: 'uploads/' })


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
    app.use('/uploads', static(path.join(__dirname,'uploads')));

    var storage = multer.diskStorage({
        destination: function(req, file, callback){
            callback(null, 'uploads')
        },
        filename: function(req, file, callback){
            callback(null, file.originalname + Date.now())
        }
    });

    //todo : change to express-fileupload
    // var upload = multer({
    //     stoage: multer.diskStorage({
    //         destination: function (req, file, callback) {
    //             callback(null, 'uploads')
    //         },
    //         filename: function (req, file, callback) {
    //             callback(null, file.originalname + Date.now())
    //         }
    //     }),
    //     limits:{
    //         files: 10,
    //         fileSize: 1024*1024*10
    //     }
    // });

    // app.use(fileUpload({
    //     limits: { fileSize: 50 * 1024 * 1024 },
    //     tempFileDir : 'uploads/'
    // }));

    app.set('upload',upload);

    app.use('/img',static(path.join(__dirname,'/img')));
    app.use('/css',static(path.join(__dirname,'/css')));
    app.set('views',__dirname + '/views');
    app.set('view engine','ejs');
    app.engine('html',require('ejs').renderFile);

}

module.exports.init = init;
