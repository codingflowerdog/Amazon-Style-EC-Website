var schema = {}

schema.createSchema = function(mongoose){
    var productSchema = new mongoose.Schema({
        title:{type:String, 'default':'', required:true},
        category:{type:String, 'default':'', required:true},
        price:{type:Number, required:true, 'default':0},
        content:{type:String, 'default':'', required:true},
        filename:{type:String, 'default':''}
    });

    productSchema.static('findById',function(id,callback){
        return this.find({'_id':id},callback);
    });

    productSchema.method('uploadProduct',function(callback) {
        return this.save(callback);
    })



    return productSchema;
}

module.exports = schema;