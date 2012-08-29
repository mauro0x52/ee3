/** Location
 *
 * @autor : Lucas Calado
 * @since : 2012-07
 *
 * @description : Server de localização da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

var app = module.exports = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.set('view engine', 'ejs');

    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controllers/Region.js')(app);
require('./controllers/Country.js')(app);
require('./controllers/State.js')(app);
require('./controllers/City.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";

    response.send(true);
});

//caso seja ambiente de produção, mostrar painel de testes
if (config.host.debuglevel === 1) {
    app.get('/test', function (request, response) {
        "use strict";

        response.render('test');
    });
}

/*  Ativando o server */
app.listen(config.host.port);