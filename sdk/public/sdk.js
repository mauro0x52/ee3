/*global console: true, Ajax: false, Tracker: false, Ui: false, document: false, alert: false */

/** Sdk
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : sdk do empreendemia
 */
var Sdk = function () {
    "use strict";

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
            errors = 0,
            loadHandler,
            errorHandler,
            script;

        /** loadHandler
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : trata o carregamento de cada módulo
         */
        loadHandler = function () {
            handled = handled + 1;
            if (handled === modules.length && errors === 0) {
                cb(null);
            }
        };

        /** errorHandler
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : trata erros no carregamento dos módulos
         */
        errorHandler = function (evt) {
            handled = handled + 1;
            cb('problem loading module ' + evt.srcElement.src);
        };

        for (i = 0; i < modules.length; i = i + 1) {
            script = document.createElement('script');
            script.src = modules[i];
            script.type = 'text/javascript';
            script.onload  = loadHandler;
            script.onerror = errorHandler;

            document.body.appendChild(script);
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
        } else {
            alert(data);
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

(function () {
    "use strict";

    var sdk = new Sdk();

    console.log('loading sdk modules');
    sdk.loadModules(['/ajax.js', '/tracker.js', '/ui.js'], function (error) {
        if (error) {
            console.error(error);
        } else {
            console.log('modules loaded successfuly');
            sdk.Ajax = Ajax;
            sdk.Tracker = Tracker;
            sdk.Ui = Ui;
            sdk.ready();
        }
    });
}());