var dispMain = async function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session,
        productInfo:''
    }

    var database = req.app.get('database');
    var productModel = database.productModel;
    var viewHistoryModel = database.viewHistoryModel;
    var productInfo = {}


    const latestProduct = await productModel.findAll(function(err,latestProductInfo){
        if(err){throw err;}
        return latestProductInfo;
    });

    const recommendProduct = await productModel.findRecommendProduct(function(err,recommendProduct){
        if(err){throw err;}
        return recommendProduct;
    });

    const viewProduct = await viewHistoryModel.findByEmail(req.session.accountEmail, async function(err,viewProductList){
        if(err){throw err;}

        console.log('1')
        if(viewProductList.length>0){
            return viewProductList
        } else {
            console.log('x')
            return [];
        }
    })

    if(viewProduct.length >0){
        var viewProduct2 = await productModel.findViewHistoryProduct(viewProduct[0].history,function(err,viewHistoryList){
            if(err){throw err;}
            console.log('3')
            console.dir(viewHistoryList[0]._doc);

            if(viewHistoryList.length > 0){
                console.log('4')
                return viewHistoryList;
            } else {
                console.log('5')
                return [];
            }
        })
    } else {
        console.log("????")
        var viewProduct2 = [];
    }


    console.log('end?');
    console.log(viewProduct2);

    productInfo.latestProduct = latestProduct;
    productInfo.recommendProduct = recommendProduct;
    productInfo.viewProduct = viewProduct2;

    context.productInfo = productInfo;

    console.log(context.productInfo);
    req.app.render('index',context,function(err,html){
        if(err){throw err};
        res.end(html);
    })

}

module.exports.dispMain = dispMain;