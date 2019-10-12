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
        session:req.session
    };

    req.app.render('product',context,function(err,html){
        if(err){throw err};

        console.log('render product page');
        res.end(html);
    })
}

module.exports.dispHistory = dispHistory;
module.exports.dispProduct = dispProduct;