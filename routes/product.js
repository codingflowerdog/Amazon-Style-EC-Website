var Q = require('q');

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

// var upload = function (req, res) {
//     console.log('called upload method');
//     var deferred = Q.defer();
//     var storage = multer.diskStorage({
//         // 서버에 저장할 폴더
//         destination: function (req, file, callback) {
//             callback(null, imagePath);
//         },
//         // 서버에 저장할 파일 명
//         filename: function (req, file, callback) {
//             console.log('filename setting');
//             file.uploadedFile = {
//                 name: req.body.filename,
//                 ext: file.mimetype.split('/')[1]
//             };
//             callback(null, file.uploadedFile.name + '.' + file.uploadedFile.ext);
//         }
//     });
//
//     var upload = multer({ storage: storage }).single('filename');
//     upload(req, res, function (err) {
//         if (err) deferred.reject();
//         else deferred.resolve(req.file.uploadedFile);
//     });
//     return deferred.promise;
// };

var procProduct = function(req,res){
    var context = {
        session:req.session
    };

    console.log('called procProduct2');
    var database = req.app.get('database');

    var productSchema = database.productSchema;
    var productModel = database.productModel;

    if(database){
        //todo : add product proc
        console.log('database connected');

        var paramTitle = req.body.title;
        var paramCategory = req.body.category;
        var paramPrice = req.body.price;
        var paramContent = req.body.content;
        var paramFileName = req.body.filename;

        var product = new database.productModel({
            'title':paramTitle,
            'category':paramCategory,
            'price':paramPrice,
            'content':paramContent,
            'filename':paramFileName
        });

        console.log('file log');
        const file = req.file
        if (!file) {
            const error = new Error('Please upload a file')
            error.httpStatusCode = 400
            return next(error)
        }
        res.send(file)

        // upload(req, res).then(function (file) {
        //     console.log('File Info');
        //     console.dir(file)
        //     if(file){
        //
        //         console.dir(file);
        //
        //         product.uploadProduct(function(err,uploadedProduct){
        //             if(err){throw err;}
        //
        //             if(uploadedProduct){
        //                 res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
        //                 res.write('<h2>상품 등록 성공</h2>')
        //                 res.end();
        //             } else{
        //                 res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
        //                 res.write('<h2>상품 등록 실패</h2>')
        //                 res.write(err.stack)
        //                 res.end();
        //             }
        //         })
        //     } else {
        //         console.log('image file does not exist')
        //     }
        // }, function (err) {
        //     console.dir(err);
        //     res.send(500, err);
        // });




    } else {
        console.log('database Error');
    }

}

module.exports.dispHistory = dispHistory;
module.exports.dispProduct = dispProduct;

module.exports.procProduct = procProduct;