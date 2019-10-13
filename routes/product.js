var multer = require('multer');
var fs = require('fs');

var dispHistory = function(req,res){
    var context = {
        session:req.session
    };

    req.app.render('history',context,function(err,html){
        if(err){throw err};

        console.log('render history page');
        res.end(html);
    })
}

var dispProduct = function(req,res){
    var context = {
        session:req.session,
        category:[
            ['DVD, 만화 & 게임','dvd&comic&game'],
            ['전기, 카메라 & 영상기기','electronic'],
            ['컴퓨터 & 사무용품','computer&office'],
            ['주방용품, 침대 & DIY','kitchen&diy'],
            ['식기, 음료 & 술','food'],
            ['약품 & 화장품','medicine']
        ]
    };

    req.app.render('product',context,function(err,html){
        if(err){throw err};

        console.log('render product page');
        res.end(html);
    })
}

var procProduct = function(req,res){
    var context = {
        session:req.session
    };

    var database = req.app.get('database');

    var productSchema = database.productSchema;
    var proddctModel = database.productModel;

    if(database){
        //todo : add product proc
    } else {
        console.log('database Error');
    }

}

module.exports.dispHistory = dispHistory;
module.exports.dispProduct = dispProduct;

module.exports.procProduct = procProduct;