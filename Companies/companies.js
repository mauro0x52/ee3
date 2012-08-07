/** Companies
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Server de empresas da empreendemia
 */

var express = require('express'),
    config  = require('./config.js');

require('express-namespace');

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
require('./controller/Sector.js')(app);
require('./controller/Company.js')(app);
require('./controller/Product.js')(app);
require('./controller/Image.js')(app);
require('./controller/Thumbnail.js')(app);
require('./controller/Phone.js')(app);
require('./controller/Address.js')(app);
require('./controller/Embedded.js')(app);
require('./controller/Link.js')(app);
require('./controller/Contact.js')(app);

/*  Métodos para dev e teste */
app.get('/ping', function (request, response) {
    "use strict";

    response.send(true);
});

//caso seja ambiente de produção, esconder erros
if (config.host.debuglevel === 1) {
    app.get('/test', function (request, response) {
        "use strict";

        response.render('test');
    });
}

/*  Ativando o server */
app.listen(config.host.port);