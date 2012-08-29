/** Files
 *
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Servico de manipulacao de imagens, upload e organizacao de
 * arquivos
 */

var imagemagick = require('imagemagick'),
    express = require('express'),
    config  = require('./config.js');

var app = express();

/*  Configurando o server */
app.configure(function () {
    "use strict";

    app.use(express.bodyParser());
    app.use(express.methodOverride());

    //caso seja ambiente de produção, esconder erros
    if (config.host.debuglevel === 0) {
        app.use(express.errorHandler({ dumpExceptions: true }));
    }

    app.use(app.router);
});

/*  Chamando controllers */
require('./controller/Image.js')(app);
require('./controller/File.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";
    response.send(true);
});

/*  Ativando o server */
app.listen(config.host.port);
