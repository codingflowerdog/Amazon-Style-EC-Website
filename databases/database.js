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

    database.db.on('disconnected',connect(app,env));

}