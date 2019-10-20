var dispMain = function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session,
        latestProduct:''
    }

    var database = req.app.get('database');
    var productModel = database.productModel;
    productModel.findAll(function(err,latestProductInfo){
        if(err){throw err;}
        context.latestProduct = latestProductInfo;
        req.app.render('index',context,function(err,html){
            if(err){throw err};

            res.end(html);
        })
    });



}

module.exports.dispMain = dispMain;