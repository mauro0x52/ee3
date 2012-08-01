/** Profile
 *
 * @autor : Lucas Kalado
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
    app.set('view engine', 'ejs');
    
    //caso seja ambiente de produção, esconder erros
    if(config.host.debuglevel === 0){
        app.use(express.errorHandler({ dumpExceptions: true }));
    }
    
    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/User.js')(app);
require('./controller/ThirdPartyLogin.js')(app);
require('./controller/App.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request,response) {
    response.send(true);
});
   
//caso seja ambiente de produção, esconder url de teste
if(config.host.debuglevel === 1){
    app.get('/test', function (request,response) {
        response.render('test');
    });
}

/*  Ativando o server */
app.listen(config.host.port);