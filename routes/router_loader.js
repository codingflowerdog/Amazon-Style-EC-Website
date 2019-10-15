var env = require('../env')

var init = function(app,router){
    console.log('router_loader init')

    env.route_info.forEach(function(route){
        var routeFile = require(route.file);

        if(route.type == 'post'){
            router.route(route.path).post(routeFile[route.method]);
        } else if(route.type == 'get'){
            router.route(route.path).get(routeFile[route.method]);
        } else if(route.type == 'upload'){
            router.route(route.path).post(app.get('upload').single('fileName'),routeFile[route.method]);
        }
    })
    console.log('라우팅 완료');

    app.use('/',router);

    //Set Error Page
    //setErrorPage(app,router);

}

var setErrorPage = function(app,router){
    app.use(function(req,res,next){
        console.log('Create 404 Error');
        next(createError(404));
    });

    app.use(function(err,req,res,next){
        var context = {}

        req.app.render('404',context,function(err,html){
            if(err){throw err;}
            res.end(html);
        })

    })

}

module.exports.init = init
