/** SDK
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Server do sdk da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express.createServer();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));

    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

app.get('/config', function (request, response) {
    "use strict";

    response.send({services : config.services});
});

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";

    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);