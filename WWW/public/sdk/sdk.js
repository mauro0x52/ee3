/*global Sdk: true, sdk: true, console: true, Ajax: false, Tracker: false, Ui: false, document: false, alert: false */

/** Sdk
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : sdk do empreendemia
 */
var Sdk = function () {
    "use strict";

    var load;
    this.modules = {};

    /** load
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : chamador ajax primitivo
     * @param url : nome dos arquivos que contem os módulos
     * @param cb : callback a ser chamado após todos os módulos terem sido carregados
     */
    load = function (url, cb) {
        var invocation;

        try {
            invocation = new XMLHttpRequest();
            if (invocation) {
                invocation.onreadystatechange = function () {
                    if (invocation.readyState === 4) {
                        cb(invocation.responseText);
                    }
                };
            } else {
                console.error('unable to create request object');
            }
            invocation.open('get', url, true);
            invocation.send(null);
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    }

    /** loadModules
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : carrega módulos externos no sdk
     * @param modules[] : nome dos arquivos que contem os módulos
     * @param cb : callback a ser chamado após todos os módulos terem sido carregados
     */
    this.loadModules = function (modules, cb) {
        var i,
            handled = 0,
            handler;

        //tratador de respostas
        handler = function (data) {
            handled++;
            eval(data);
            if (handled >= modules.length) {
                load('./config', function (data) {
                    var result;
                    eval('result = ' + data);

                    sdk.config = result;
                    sdk.App = new sdk.modules.apps(sdk);
                    cb();
                });
            }
        };

        for (i = 0; i < modules.length; i = i + 1) {
            load(modules[i], handler);
        }
    };
};

var sdk = new Sdk();
(function () {
    "use strict";

    console.log('loading sdk modules');
    sdk.loadModules(['sdk/ajax.js', 'sdk/tracker.js', 'sdk/ui.js', 'sdk/app.js', 'sdk/route.js', 'js/empreendemia.js'], function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log('modules loaded successfuly');
            sdk.apps = new sdk.modules.apps(sdk);
            sdk.empreendemia.start();
            //sdk.App.tool('empresas', '0.1', 'lista-de-empresas');
        }
    });
}());