/** Sdk
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : sdk do empreendemia
 */
sdk = {
    modules : {},

    /** loadModules
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : carrega módulos externos no sdk
     * @param modules[] : nome dos arquivos que contem os módulos
     * @param cb : callback a ser chamado após todos os módulos terem sido carregados
     */
    loadModules : function (modules, cb) {
        "use strict";

        var i,
            handled = 0,
            handler;

        //tratador de respostas
        handler = function (data) {
            handled++;
            eval(data);
            /* verifica se todos os módulos ja foram carregados */
            if (handled >= modules.length) {
                /* carrega arquivo de configuração */
                ajaxRequest('./config', 'GET', {}, function (data) {
                    sdk.config = eval('(' + data + ')');
                    sdk.apps = new sdk.modules.apps(sdk);
                    cb.apply(sdk);
                });
            }
        };

        for (i = 0; i < modules.length; i = i + 1) {
            ajaxRequest(modules[i], 'GET', {}, handler);
        }
    }
};