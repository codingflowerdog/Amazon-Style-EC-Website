var schema = {}

schema.createSchema = function(mongoose){
    var productSchema = new mongoose.Schema({
        writer:{type:String, 'default':'', required:true},
        title:{type:String, 'default':'', required:true},
        category:{type:String, 'default':'', required:true},
        price:{type:Number, required:true, 'default':0},
        content:{type:String, 'default':'', required:true},
        filename:{type:String, 'default':''},
        review:{type:Number, 'default':0}
    });

    productSchema.static('findAll',function(callback){
        return this.find({},callback).limit(10);
    });

    productSchema.static('findById',function(id,callback){
        this.updateOne({'_id':id},{$inc : {'review':1}},callback);
    });

    productSchema.method('uploadProduct',function(callback) {
        return this.save(callback);
    })



    return productSchema;
}

module.exports = schema;