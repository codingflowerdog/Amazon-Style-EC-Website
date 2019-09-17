var crypto = require('crypto')

var schema = {}

schema.createSchema = function(mongoose){
    var accountSchema = mongoose.Schema({
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
    }).get(function(){
        return this._password;
    })

    accountSchema.static('findAll',function(callback){
        return this.find({},callback);
    })

    accountSchema.static('findByEmail',function(email,callback){
        return this.find({'email':email},callback)
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
            return this.encryptPassword(password,this.salt) === hashed_password;
        }
    })

    return accountSchema;
}

module.exports = schema;