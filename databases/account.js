var crypto = require('crypto')

var schema = {}

// Todo : Add Passport, Flash Message, Log Module

schema.createSchema = function(mongoose){
    var accountSchema = new mongoose.Schema({
        name:{type:String, 'default':'', required:true},
        email:{type:String, 'default':'', required:true},
        hashed_password:{type:String, required:true, 'default':' '},
        salt:{type:String, required:true},
        phone:{type:String, 'default':''},
        date:{type:Date, index:{unique:true}, 'default':Date.now()}
    });

    accountSchema.virtual('password').set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
        console.log('password virtual set : ' + this.hashed_password)
    }).get(function(){
        console.log('password virtual get');
        return this._password;
    })

    accountSchema.static('findAll',function(callback){
        return this.find({},callback);
    })

    accountSchema.static('findByEmail',function(email,callback){
        return this.find({'email':email},callback)
    })

    accountSchema.static('updateEmail',function(email,changeEmail,callback){
        this.updateOne({'email':email},{$set : {'email':changeEmail}},callback);
    })

    accountSchema.static('updateName',function(email,changeName,callback){
        this.updateOne({'email':email},{$set : {'name':changeName}},callback);
    })

    accountSchema.static('updatePhone',function(email,changePhone,callback){
        return this.update({'email':email},{$set : {'phone':changePhone}},callback);
    })

    accountSchema.static('updatePassword',function(email,changePassword,salt,callback){
        return this.update({'email':email},{$set : {'hashed_password':changePassword, 'salt':salt}},callback);
    })

    accountSchema.method('createAccount',function(callback) {
        return this.save(callback);
    })

    accountSchema.method('encryptPassword',function(password,inSalt){
        if(inSalt){
            return crypto.createHmac('sha256',inSalt).update(password).digest('hex');
        } else{
            return crypto.createHmac('sha256',this.salt).update(password).digest('hex');
        }
    })

    accountSchema.method('makeSalt',function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    })

    accountSchema.method('authenticate',function(password,inSalt,hashed_password){
        if(inSalt){
            return this.encryptPassword(password,inSalt) === hashed_password;
        } else{
            return this.encryptPassword(password) === this.hashed_password;
        }
    })

    return accountSchema;
}

module.exports = schema;