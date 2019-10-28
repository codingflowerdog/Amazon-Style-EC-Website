var dispMain = async function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session,
        productInfo:''
    }

    var database = req.app.get('database');
    var productModel = database.productModel;
    var viewHistory = database.viewHistoryModel;
    var productInfo = {}


    const latestProduct = await productModel.findAll(function(err,latestProductInfo){
        if(err){throw err;}
        return latestProductInfo;
    });

    const recommendProduct = await productModel.findRecommendProduct(function(err,recommendProduct){
        if(err){throw err;}
        return recommendProduct;
    });

    const viewProduct = await viewHistoryModel.findByEmail(req.session.accountEmail, function(err,viewProductList){
        if(err){throw err;}
        return viewProductList;
    })

    productInfo.latestProduct = latestProduct;
    productInfo.recommendProduct = recommendProduct;
    productInfo.viewProduct = viewProduct;

    context.productInfo = productInfo;

    console.log(context.productInfo);
    req.app.render('index',context,function(err,html){
        if(err){throw err};
        res.end(html);
    })

}

module.exports.dispMain = dispMain;