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
    load = function (url, cb){
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
            console.error(error);
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

                    sdk.config = result.services;
                    sdk.App = new sdk.modules.app(sdk);
                    cb();
                });
            }
        };

        for (i = 0; i < modules.length; i = i + 1) {
            load(modules[i], handler);
        }
    };
};

/** console
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : logger do sdk
 */
var console = {
    /** log
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : apresenta mensagem no console
     * @param data : mensagem a ser apresentada
     */
    log : function (data) {
        "use strict";

        var element = document.getElementById('console');
        if (element) {
            element.innerHTML = document.getElementById('console').innerHTML + data + '<br />';
        }
    },

    /** error
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : apresenta mensagem de erro no console
     * @param data : mensagem a ser apresentada
     */
    error : function (data) {
        "use strict";

        this.log('<font color="red">' + data + '</font>');
    },

    /** spacer
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : apresenta espaçamento no console
     */
    spacer : function () {
        "use strict";

        this.log('<font color="green">-------------------------------------------------------------------------------------------------------------</font>');
    }
};

var sdk = new Sdk();
(function () {
    "use strict";

    console.log('loading sdk modules');
    sdk.loadModules(['/ajax.js', '/tracker.js', '/ui.js', '/app.js'], function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log('modules loaded successfuly');
        }
    });
}());