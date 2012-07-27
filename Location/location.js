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
    
    if (config.host.debuglevel === 1){
        app.set('view engine', 'ejs');
    }
    
    
    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }
    
    app.use(app.router);
});

/*  Chamando controllers */
require('./controllers/Country.js')(app);
require('./controllers/State.js')(app);
require('./controllers/City.js')(app);

//caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 1){
        app.get('/test', function (request,response) {
            response.render('test');
        });
    }

/*  Ativando o server */
app.listen(config.host.port);