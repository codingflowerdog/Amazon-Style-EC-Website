var dispMain = async function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session,
        productInfo:''
    }

    //var database = req.app.get('database');
    //var productModel = database.productModel;
    // productModel.findAll(function(err,latestProductInfo){
    //     if(err){throw err;}
    //     context.latestProduct = latestProductInfo;
    //     req.app.render('index',context,function(err,html){
    //         if(err){throw err};
    //
    //         res.end(html);
    //     })
    // });

    context.productInfo = await initProductList(req,res);

    console.log('main???')
    console.log(context.productInfo);
    req.app.render('index',context,function(err,html){
        if(err){throw err};
        res.end(html);
    })



}

async function initProductList(req,res){
    var database = req.app.get('database');
    var productModel = database.productModel;
    var productInfo = {}

    const latestProduct = await productModel.findAll(function(err,latestProductInfo){
        if(err){throw err;}
        console.log('1');
        return latestProductInfo;
    });

    console.log('3');
    const recommendProduct = await productModel.findRecommendProduct(function(err,recommendProduct){
        console.log('2???');
        if(err){throw err;}
        console.log('1');
        console.log('1');
        console.log('1');
        return recommendProduct;
    });

    console.log('4');
    productInfo.latestProduct = latestProduct;
    productInfo.recommendProduct = recommendProduct;

    console.log('async function test');
    console.log(productInfo);
    return productInfo;
}

module.exports.dispMain = dispMain;