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

    var context = {
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
    var context = {
    }


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

                            context.session = req.session;

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
                                req.session.authorized = true;

                                context.session = req.session;

                                console.log('Login Success');
                                req.app.render('index', context, function (err, html) {
                                    if (err) {
                                        throw err;
                                    }
                                    res.end(html)
                                })
                            } else {
                                context.session = req.session;
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

var dispAccount = function(req,res){
    var context = {
        session:req.session
    }

    var database = req.app.get('database');
    var accountSchema = database.accountSchema;
    var accountModel = database.accountModel;

    var edit = req.query.edit;

    if(database){
        accountModel.findByEmail(req.session.accountEmail,function(err,accountInfo){
            if(err){
                //To do : add error page
                console.err('사용자 검색 에러')
            } else {
                if(accountInfo.length > 0){
                    context.email = accountInfo[0]._doc.email;
                    context.name = accountInfo[0]._doc.name;
                    context.phone = accountInfo[0]._doc.phone;
                    context.password = '********';
                    context.edit = edit;

                    if(req.session.authorized){
                        req.app.render('account',context,function(err,html){
                            if(err){throw err};
                            res.end(html);
                        })
                    } else{
                        dispSignIn(req,res)
                    }


                } else{
                    //To do : Email not found
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
        //To do : Make Error Page
        console.log('database is closed');
        res.writeHead('200',{'Content-Type':'text/html;charset=utf8'})
        res.write('<h2>데이터베이스 연결 실패</h2>')
        res.write(err.stack)
        res.end();
    }
}

var procAccount = function(req,res){
    var context = {
        session:req.session
    }
    var edit = req.query.edit;
    var database = req.app.get('database');

    if(database){
        var accountSchema = database.accountSchema;
        var accountModel = database.accountModel;
        var accountEmail = req.session.accountEmail

        accountModel.findByEmail(accountEmail,function(err,accountInfo){
            if(err){throw err};

            var paramEmail = accountInfo[0]._doc.email;

            if(accountInfo.length > 0){

                context.email = accountInfo[0]._doc.email;
                context.name = accountInfo[0]._doc.name;
                context.phone = accountInfo[0]._doc.phone;
                context.password = '********';
                context.edit = '';

                if(edit === 'email'){
                    var paramChangeEmail = req.body.changeEmail;
                    var paramPassword = req.body.password;
                    var account = new accountModel({'email':paramEmail});

                    var auth = account.authenticate(paramPassword,accountInfo[0]._doc.salt,accountInfo[0]._doc.hashed_password);

                    if(auth){
                        accountModel.updateEmail(paramEmail,paramChangeEmail,function(err,changedAccountInfo){
                            if(err){throw err};

                            req.session.accountEmail = paramChangeEmail;

                            context.email = paramChangeEmail;

                            console.log('Email Change Success');
                            req.app.render('account',context,function(err,html){
                                if(err){throw err};
                                res.end(html);
                            })
                        })
                    } else {
                        //todo : add message
                        console.log('Email Change Fail - wrong password')
                        req.app.render('account',context,function(err,html){
                            if(err){throw err};
                            res.end(html);
                        })
                    }
                } else if(edit === 'name'){
                    var paramChangeName = req.body.changeName;

                    accountModel.updateName(paramEmail,paramChangeName,function(err,changedAccountInfo){
                        if(err){throw err};

                        context.name = paramChangeName;
                        console.log('Test')
                        console.log(paramEmail);
                        console.log(paramChangeName);
                        console.dir(changedAccountInfo);

                        console.log('Name Change Success');
                        req.app.render('account',context,function(err,html){
                            if(err){
                                console.dir(err);
                                throw err
                            };

                            console.log(context);
                            res.end(html);
                        })
                    })
                } else if(edit === 'phone'){
                    var paramChangePhone = req.body.changePhone;

                    accountModel.updatePhone(paramEmail,paramChangePhone,function(err,changedAccountInfo){
                        if(err){throw err};

                        context.phone = paramChangePhone;

                        console.log('Phone Change Success');


                        req.app.render('account',context,function(err,html){
                            if(err){throw err};
                            res.end(html);
                        })
                    })

                } else if(edit === 'password'){
                    var paramEmail = req.session.accountEmail;
                    var paramPassword = req.body.password;
                    var paramChangePassword = req.body.changePassword;

                    var account = new accountModel({'email':paramEmail});
                    var auth = account.authenticate(paramPassword,accountInfo[0]._doc.salt,accountInfo[0]._doc.hashed_password);

                    if(auth){
                        account.salt = account.makeSalt();
                        account.hashed_password = account.encryptPassword(paramChangePassword);

                        accountModel.updatePassword(paramEmail,account.hashed_password,account.salt,function(err,changedAccountInfo){
                            if(err){throw err};

                            console.log('password Change Success');
                            req.app.render('account',context,function(err,html){
                                if(err){throw err};
                                res.end(html);
                            })
                        })
                    } else {
                        //todo : add message
                        console.log('password Change Fail - wrong password')
                        req.app.render('account',context,function(err,html){
                            if(err){throw err};
                            res.end(html);
                        })
                    }

                } else {

                }
                //var auth = accountModel.authenticate(accountInfo[0]._doc.email, accountInfo[0]._doc.salt,accountInfo[0]._doc.hashed_password);




            } else {
                //todo : add error page
            }
        })

    } else {
        //Todo : Add Database Error Page
    }

}

module.exports.dispSignUp = dispSignUp;
module.exports.dispSignIn = dispSignIn;
module.exports.dispAccount = dispAccount;

module.exports.procSignUp = procSignUp;
module.exports.procSignIn = procSignIn;
module.exports.procSignOut = procSignOut;
module.exports.procAccount = procAccount;