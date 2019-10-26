var schema = {}

schema.createSchema = function(mongoose){
    var viewHistorySchema = new mongoose.Schema({
       email:{type:String, 'default':'', required:true},
       history:{type:Array,'default':''}
    });

    
    return viewHistorySchema;
};

module.exports = schema;