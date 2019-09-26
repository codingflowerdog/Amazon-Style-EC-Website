var dispSignUp = function(req,res){
    console.log('dispSignUp 호출됨')

    var context = {
        title:'HappyMall - signUp',
        session:req.session
    }

    req.app.render('signUp',context,function(err,html){
        if(err){throw err};

        res.end(html);
    })
}

var createAccount = function(database,name,email,phone,password,callback){

    var account = new database.accountModel(
        {
            'name' : name,
            'email' : email,
            'phone' : phone,
            'password' : password
    });

    account.save(function(err,createdAccount){
        if(err){
            callback(err,null);
            return
        }
        callback(null,createdAccount)
    })
}
var procSignUp = function(req,res){
    console.log('procSignUp is Called');

    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;
    var checkPassword = req.body.checkPassword;

    console.log('name : ' + name);
    console.log('email : ' + email);
    console.log('phone : ' + phone);
    console.log('password : ' + password);

    var database = req.app.get('database');

    if(database){
        if(password === checkPassword){
            createAccount(database,name,email,phone,password,function(err,createdAccount){
                if(err){
                    console.err('계정 추가 중 에러 발생 : ' + err.stack);
                    //To do : Make Error Page
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
                    res.write('<h2>사용자 추가 중 에러 발생</h2>')
                    res.write(err.stack)
                    res.end();

                    return;
                }

                if(createdAccount){
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
                    res.write('<h2>계정 추가 성공</h2>')
                    res.end();
                } else{
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
                    res.write('<h2>계정 추가 실패</h2>')
                    res.write(err.stack)
                    res.end();
                }

            })
        } else{
            //To do : Make Error Page
            console.log('wrong password');
            res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
            res.write('<h2>패스워드 불일치</h2>')
            res.write(err.stack)
            res.end();
        }
    } else{
        //To do : Make Error Page
        console.log('database is closed');
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.write(err.stack)
        res.end();
    }

}

var dispSignIn = function(req,res){

    var paramEmail = req.body.email;
    var mode = req.query.mode;

    var context = {
        title:'HappyMall - signIn',
        session:req.session,
        accountEmail:paramEmail
    }

    console.log(paramEmail)
    if(!req.session.accountEmail){
        console.log('checkEmail')
        req.app.render('signIn',context,function(err,html){
            if(err){throw err;}
            res.end(html);
        })
    } else {
        console.log('checkPassword')
        req.app.render('signIn',context,function(err,html){
            if(err){throw err;}
            res.end(html);
        })
    }


}

var procSignIn = function(req,res){
    var paramEmail = req.body.email;
    var paramPassword = req.body.password;
    var database = req.app.get('database');
    var accountSchema = database.accountSchema;
    var accountModel = database.accountModel;
    var context = {}

    context.title = 'HappyMall - SignIn'

    if(database){
        if(req.session.authorized === true){
            console.log('Sign In Already')
        } else {
            if(paramEmail) {
                if (req.session.accountEmail) {
                    console.log('session delete');
                    req.session.destroy();
                }
                console.log('ParamEmail :: ' + paramEmail);
                accountModel.findByEmail(paramEmail, function (err, accountInfo) {
                    if (err) {
                        //To do : Add Error Page
                        console.err('사용자 인증 에러');

                        //Temp Error Page
                    } else {
                        if (accountInfo.length > 0) {
                            console.log('paramEmail');
                            req.session.accountEmail = paramEmail;
                            req.session.accountName = accountInfo[0]._doc.name;

                            context.accountEmail = req.session.accountEmail;
                            context.accountName = req.session.accountName;

                            req.app.render('signIn', context, function (err, html) {
                                if (err) {
                                    throw err;
                                }
                                res.end(html)
                            })
                        } else {
                            //To do : Login Failed
                            console.log('Email not found');
                            req.app.render('signIn', context, function (err, html) {
                                if (err) {
                                    throw err;
                                }
                                res.end(html)
                            })
                        }
                    }
                })
            } else{
                //To do : Check Password
                accountModel.findByEmail(req.session.accountEmail, function (err, accountInfo) {
                    if (err) {
                        //To do : Add Error Page
                        console.err('사용자 인증 에러');

                        //Temp Error Page
                    } else {
                        if (accountInfo.length > 0) {
                            var account = new accountModel({'email':req.session.accountEmail})
                            var auth = account.authenticate(paramPassword,accountInfo[0]._doc.salt, accountInfo[0]._doc.hashed_password);
                            if (auth) {
                                context.accountEmail = req.session.accountEmail;
                                context.accountName = req.session.accountName;

                                console.log('Login Success');
                                req.app.render('index', context, function (err, html) {
                                    if (err) {
                                        throw err;
                                    }
                                    res.end(html)
                                })
                            } else {
                                context.accountEmail = req.session.accountEmail;
                                context.accountName = req.session.accountName;
                                //To do : Add Error Proc
                                req.app.render('signIn', context, function (err, html) {
                                    if (err) {
                                        throw err;
                                    }
                                    res.end(html)
                                })
                            }
                        } else {
                            //To do : Login Failed
                            console.log('Email not found');
                            req.app.render('signIn', context, function (err, html) {
                                if (err) {
                                    throw err;
                                }
                                res.end(html)
                            })
                        }
                    }
                })
            }
        }
    } else{
        //To do : Add error Page
        console.log('Database connected Failed')
    }
}

var procSignOut = function(req,res){
    req.session.destroy(function(err){
        if(err){throw err}
        res.redirect('/')
    });
}

module.exports.dispSignUp = dispSignUp;
module.exports.dispSignIn = dispSignIn;

module.exports.procSignUp = procSignUp;
module.exports.procSignIn = procSignIn;
module.exports.procSignOut = procSignOut;