/** Auth
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Server de autenticação da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

require('express-namespace');

var app = module.exports = express.createServer();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    
    //caso seja ambiente de produção, esconder erros
    if(config.host.debuglevel === 0){
        app.use(express.errorHandler({ dumpExceptions: true }));
    }
    
    app.use(app.router);
});

/*  Configurando controllers */
app.namespace('/user', function () {
    require('./controllers/User.js')(app);
});

app.namespace('/user/:login', function () {
    require('./controllers/ThirdPartyLogin.js')(app);
    require('./controllers/App.js')(app);
});

/*  Ativando o server */
app.listen(config.host.port);