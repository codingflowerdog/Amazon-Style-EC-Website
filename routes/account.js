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
            return;
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

module.exports.dispSignUp = dispSignUp;
module.exports.procSignUp = procSignUp;