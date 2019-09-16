var dispSignUp = function(req,res){
    console.log('dispSignUp 호출됨')

    var context = {
        title:'HappyMall - signUp'
    }

    req.app.render('signUp',context,function(err,html){
        if(err){throw err};

        res.end(html);
    })
}

module.exports.dispSignUp = dispSignUp;