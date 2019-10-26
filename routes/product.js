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

    var database = req.app.get('database');
    var productModel = database.productModel;

    productModel.findById(req.query.id,function(err,findProductInfo){
        if(err){throw err}

        if(findProductInfo){
            context.id = req.query.id;
            context.product = findProductInfo._doc;
        } else {
            context.id='';
        }
        console.dir(context);
        req.app.render('product',context,function(err,html){
            if(err){throw err};

            console.log('render product page');
            res.end(html);
        })

    })


}


var procProduct = function(req,res){
    var context = {
        session:req.session
    };

    console.log('called procProduct2');
    var database = req.app.get('database');


    if(database){
        //todo : add product proc
        console.log('database connected');

        console.log('file log');
        const file = req.file
        if (!file) {
            res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
            res.write('<h2>이미지 없음</h2>')
            res.write(err.stack)
            res.end();
        } else {
            var paramWriter = req.session.accountEmail;
            var paramTitle = req.body.title;
            var paramCategory = req.body.category;
            var paramPrice = req.body.price;
            var paramContent = req.body.content;
            var paramFileName = req.file.filename;

            var product = new database.productModel({
                'writer':paramWriter,
                'title':paramTitle,
                'category':paramCategory,
                'price':paramPrice,
                'content':paramContent,
                'filename':paramFileName
            });

            product.uploadProduct(function(err,uploadedProduct){
                if(err){throw err;}

                if(uploadedProduct){
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
                    res.write('<h2>상품 등록 성공</h2>')
                    res.end();
                } else{
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
                    res.write('<h2>상품 등록 실패</h2>')
                    res.write(err.stack)
                    res.end();
                }
            })
        }

    } else {
        console.log('database Error');
    }

}

var procOrder = function(req,res){
    var database = req.app.get('database');
    var accountEmail = req.session.accountEmail;
    var orderProductId = req.query.id;
    var orderHistoryModel = database.orderHistoryModel;

    orderHistoryModel.findByEmail(accountEmail,function(err,orderHistory){
        if(err){throw err;};

        if(orderHistory){
            //todo : add OrderHistory
        } else{

        }
    })


    var historyModel = new database.orderHistoryModel({
        email:req.session.accountEmail,

    });
}

module.exports.dispHistory = dispHistory;
module.exports.dispProduct = dispProduct;

module.exports.procProduct = procProduct;
module.exports.procOrder = procOrder;