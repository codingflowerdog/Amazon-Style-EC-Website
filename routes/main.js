var main = function(req,res){
    console.log('main 호출됨')

    var context = {
        session:req.session
    }

    req.app.render('index',context,function(err,html){
        if(err){throw err};

        res.end(html);
    })
}

module.exports.main = main;