module.exports = {
    server_port : 3000,
    db_url : 'mongodb://localhost:27017/amazon',
    db_schemas : [
        {
            file:'./account', collection:'account',
            schemaName:'accountSchema', modelName:'accountModel'
        }
    ],
    route_info:[
        {file:'./main',path:'/',method:'main',type:'get'},
        {file:'./account',path:'/dispSignUp', method:'dispSignUp', type:'get'},
        {file:'./account',path:'/procSignUp', method:'procSignUp', type:'post'}
    ]

}





