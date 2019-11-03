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

    const popularProduct = await productModel.findPopularProduct(function(err,popularProduct){
        if(err){throw err;}
        return popularProduct;
    });

    const recommendProduct = await productModel.findRecommendProduct(function(err,recommendProduct){
        if(err){throw err;}
        console.log('in callback :: findRecommendProduct');
        console.log(recommendProduct)
        return recommendProduct;
    });

    const viewProduct = await viewHistoryModel.findByEmail(req.session.accountEmail, function(err,viewProductList){
        if(err){throw err;}
        return viewProductList
    })

    if(viewProduct.length > 0){
        console.log(viewProduct);

        console.log('Call CheckProduct')
        console.log(viewProduct);
        await productModel.findById(function(err,checkProduct){
            if(err){throw err;}
            if(checkProduct){
                productInfo.checkProduct = checkProduct;
            } else {
                productInfo.checkProduct = [];
            }
        });

        await productModel.findViewHistoryProduct(viewProduct[0].history,function(err,viewHistoryList){
            if(err){throw err;}
            console.log('ViewHistoryList ==>')
            console.log(viewHistoryList)

            if(viewHistoryList.length > 0){
                productInfo.viewProduct = viewHistoryList;
            }
        })
    }


    productInfo.latestProduct = latestProduct;
    productInfo.popularProduct = popularProduct;
    productInfo.recommendProduct = recommendProduct;

    context.productInfo = productInfo;

    console.log(context.productInfo);
    req.app.render('index',context,function(err,html){
        if(err){throw err};
        res.end(html);
    })

}

module.exports.dispMain = dispMain;