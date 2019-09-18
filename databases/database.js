var mongoose = require('mongoose');

var database = {}

database.init = function(app,env){
    console.log('Database Init')

    connect(app,env);
}

function connect(app,env){
    console.log('connect가 호출됨');

    mongoose.Promise = global.Promise;
    mongoose.connect(env.db_url);
    database.db = mongoose.connection;

    database.db.on('error',console.error.bind(console,'mongoose connection error'));
    database.db.on('open',function(){
        console.log('connected database');

        createSchema(app,env);
    });

    database.db.on('disconnected',connect);

}

function createSchema(app,env){
    console.log('createSchema가 호출됨')

    for(var i=0; i < env.db_schemas.length; i++){
        var curItem = env.db_schemas[i];
        var curSchema = require(curItem.file).createSchema(mongoose);
        var curModel = mongoose.model(curItem.collection,curSchema);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;

    }

    app.set('database',database);
}

module.exports = database;