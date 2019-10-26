var schema = {}

schema.createSchema = function(mongoose){
    var orderHistorySchema = new mongoose.Schema({
        email:{type:String, 'default':'', required:true},
        orderedList:{type:Array,'default':''}
    });

    orderHistorySchema.static('findByEmail',function(email,callback){
        return this.find({email:email},callback);
    });

    orderHistorySchema.static('updateOrderHistory',function(email,orderedList,callback){
        return this.updateOne({email:email},{$set : {'orderedList':orderedList}},callback);
    });

    orderHistorySchema.method('saveOrderHistory',function(callback) {
        return this.save(callback)
    });

    return orderHistorySchema;
};

module.exports = schema;