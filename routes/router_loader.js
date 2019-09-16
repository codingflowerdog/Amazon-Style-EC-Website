var env = require('../env')

var init = function(app,router){
    console.log('router_loader init')

    env.route_info.forEach(function(route){
        var routeFile = require(route.file);

        if(route.type == 'post'){
            router.route(route.path).post(routeFile[route.method]);
        } else if(route.type == 'get'){
            router.route(route.path).get(routeFile[route.method]);
        }
    })
    console.log('라우팅 완료');

    app.use('/',router);

}

module.exports.init = init
