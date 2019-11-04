var dispHistory = async function(req,res){
    var context = {
        session:req.session,
        productInfo:''
    };

    var database = req.app.get('database');
    var productModel = database.productModel;
    var orderHistoryModel = database.orderHistoryModel;
    var productInfo = {}

    var orderHistory = await orderHistoryModel.findByEmail(req.session.accountEmail,function(err,orderHistoryList){
        if(err){throw err;}
        return orderHistoryList;

    })

    if(orderHistory.length>0){
        console.log('orderHistory==>');
        console.log(orderHistory);
        await productModel.findByList(orderHistory[0].orderedList,function(err,orderHistoryList){
            if(err){throw err;}
            productInfo.orderHistory = orderHistoryList;
        })
    }


    context.productInfo = productInfo;

    if(req.session.accountEmail){
        req.app.render('history',context,function(err,html){
            if(err){throw err};

            console.log('render history page');
            res.end(html);
        })
    } else {
        res.redirect('/dispSignIn');
    }

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

    var accountEmail = req.session.accountEmail;
    var viewProductId = req.query.id;

    var database = req.app.get('database');
    var productModel = database.productModel;

    productModel.findById(viewProductId,function(err,findProductInfo){
        if(err){throw err;}

        console.log('in findById : ' + viewProductId);
        if(findProductInfo){
            context.id = accountEmail;
            context.product = findProductInfo._doc;
        } else {
            context.id='';
        }
        console.dir(context);

        const viewHistoryModel = database.viewHistoryModel;

        console.log('view History Find Called');
        viewHistoryModel.findByEmail(accountEmail,function(err,findViewHistoryInfo){
            if(err){throw err;}
            console.log('here?');
            console.log('in findByEmail : ' + viewProductId);

            if(findViewHistoryInfo.length > 0 ){

                var historyList = findViewHistoryInfo[0].history;

                if(!historyList.includes(viewProductId)){
                    historyList.push(viewProductId);
                } else {
                    // viewHistoryList Updated by ES6 filter
                    historyList = [viewProductId].concat(historyList.filter(id => id !== viewProductId));
                }

                viewHistoryModel.updateByEmail(req.session.accountEmail,historyList,function(err,updatedViewHistory){
                    if(err){throw err;}

                    if(updatedViewHistory.ok === 1){
                        console.log('조회목록 갱신 성공');
                    } else {
                        console.log('조회목록 갱신 실패');
                    }
                })
            } else {
                const viewHistory = new viewHistoryModel({
                    email:accountEmail,
                    history:[viewProductId]
                })

                viewHistory.saveViewHistory(function(err,createdViewHistory){
                    if(err){throw err;}

                    console.log('in saveViewHistory : ' + viewProductId);

                    if(createdViewHistory){
                        console.log('조회목록 추가 완료');
                    } else{
                        console.log('조회목록 추가 실패');
                    }
                })
            }
        })

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
        if(orderHistory.length > 0){

            if(!orderHistory[0].orderedList.includes(orderProductId)){
                orderHistory[0].orderedList.push(orderProductId);
                orderHistoryModel.updateOrderHistory(accountEmail,orderHistory[0].orderedList,function(err,updatedOrderHistory){
                    if(err){throw err;}

                    console.log(updatedOrderHistory);
                    if(updatedOrderHistory.ok === 1){
                        console.log('구매이력 추가 완료');
                        console.log(updatedOrderHistory);
                        res.redirect('/');
                    } else {
                        console.log('구매이력 추가 실패');
                        res.redirect('/');
                    }

                })
            } else {
                console.log('기존 구매이력 존재');
                res.redirect('/');
            }

        } else{
            const historyModel = new database.orderHistoryModel({
                email:req.session.accountEmail,
                orderedList:[orderProductId]
            });
            console.log('모델 생성 성공');

            historyModel.saveOrderHistory(function(err,createdOrderHistory){
                if(err){throw err;}

                if(createdOrderHistory){
                    console.log('구매이력 추가 완료');
                    console.log(createdOrderHistory);
                    res.redirect('/');
                } else{
                    console.log('구매이력 추가 실패');
                    res.redirect('/');
                }
            })
        }
    });
}

module.exports.dispHistory = dispHistory;
module.exports.dispProduct = dispProduct;

module.exports.procProduct = procProduct;
module.exports.procOrder = procOrder;