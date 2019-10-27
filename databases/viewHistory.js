var schema = {}

schema.createSchema = function(mongoose){
    var viewHistorySchema = new mongoose.Schema({
       email:{type:String, 'default':'', required:true},
       history:{type:Array,'default':''}
    });


    viewHistorySchema.static('findByEmail',function(email,callback){
        return this.find({email:email},callback);
    })

    viewHistorySchema.static('updateByEmail',function(email,historyList,callback){
        return this.updateOne({email:email},{$set : {'history':historyList}},callback);
    })

    viewHistorySchema.method('saveViewHistory',function(callback){
        return this.save(callback);
    })
    
    return viewHistorySchema;
};
module.exports = schema;