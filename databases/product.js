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

    // Todo : Add OrderHistory, ReadHistory Schema

    productSchema.static('findAll',function(callback){
        return this.find({},callback).limit(15);
    });

    productSchema.static('findById',function(id,callback) {
        return this.findOneAndUpdate({'_id': new mongoose.Types.ObjectId(id)}, {$inc: {'review': 1}}, callback);
    });

    productSchema.static('findRecommendProduct',function(callback) {
        return this.find({},callback).sort({review:-1}).limit(10);
    });

    productSchema.static('findViewHistoryProduct',function(viewHistoryList,callback) {
        var productIdList = [];
        for (id in viewHistoryList) {
            var objectId = viewHistoryList[id];
            productIdList.push( new mongoose.Types.ObjectId(objectId) );
        }
        return this.find({'_id':{$in:productIdList}},callback).limit(15);
    });


    productSchema.static('deleteById',function(id,callback){
        this.deleteOne({'_id':id},callback);
    });

    productSchema.method('uploadProduct',function(callback) {
        return this.save(callback);
    });

    return productSchema;
};

module.exports = schema;