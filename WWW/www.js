/** App
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : www da Empreendemia 3
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    /* Serve a pasta public */
    app.use('/', express.static('public'));

    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";

    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);