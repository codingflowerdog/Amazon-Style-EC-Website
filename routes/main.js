var dispMain = async function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session,
        productInfo:''
    }

    var database = req.app.get('database');
    var productModel = database.productModel;
    var productInfo = {}


    const latestProduct = await productModel.findAll(function(err,latestProductInfo){
        if(err){throw err;}
        return latestProductInfo;
    });

    const recommendProduct = await productModel.findRecommendProduct(function(err,recommendProduct){
        if(err){throw err;}
        return recommendProduct;
    });

    productInfo.latestProduct = latestProduct;
    productInfo.recommendProduct = recommendProduct;

    context.productInfo = productInfo;

    console.log(context.productInfo);
    req.app.render('index',context,function(err,html){
        if(err){throw err};
        res.end(html);
    })

}

module.exports.dispMain = dispMain;