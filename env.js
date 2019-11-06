module.exports = {
    server_port : 3000,
    db_url : 'mongodb://localhost:27017/amazon',
    db_schemas : [
        {
            file:'./account', collection:'account',
            schemaName:'accountSchema', modelName:'accountModel'
        },
        {
            file:'./product', collection:'product',
            schemaName:'productSchema', modelName:'productModel'
        },
        {
            file:'./orderHistory', collection:'orderHistory',
            schemaName:'orderHistorySchema', modelName:'orderHistoryModel'
        },
        {
            file:'./viewHistory', collection:'viewHistory',
            schemaName:'viewHistorySchema', modelName:'viewHistoryModel'
        }

    ],
    route_info:[
        {file:'./main', path:'/', method:'dispMain', type:'get'},
        {file:'./account', path:'/dispSignUp', method:'dispSignUp', type:'get'},
        {file:'./account', path:'/dispSignIn', method:'dispSignIn', type:'get'},
        {file:'./account', path:'/dispSignIn', method:'dispSignIn', type:'post'},
        {file:'./account', path:'/dispAccount', method:'dispAccount', type:'get'},
        {file:'./product', path:'/dispHistory', method:'dispHistory', type:'get'},
        {file:'./product', path:'/dispProduct', method:'dispProduct', type:'get'},

        {file:'./account', path:'/procSignUp', method:'procSignUp', type:'post'},
        {file:'./account', path:'/procSignIn', method:'procSignIn', type:'post'},
        {file:'./account', path:'/procSignOut', method:'procSignOut', type:'get'},
        {file:'./account', path:'/procAccount', method:'procAccount', type:'post'},

        {file:'./product', path:'/procProduct', method:'procProduct', type:'upload'},
        {file:'./product', path:'/procOrder', method:'procOrder', type:'post'},
        {file:'./product', path:'/procDeleteHistory', method:'procDeleteHistory', type:'post'}
    ]
}





