/*global sdk: false*/

/** Route
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de rotas do navegador
 */
sdk.modules.route = function (app) {
    /** hash
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : seta ou retorna a parte da url após o #!/app-name/*
     * @param value : valor a ser setado
     */
    this.hash = function (value) {
        if (value) {
            location.hash = '!#/' + app.name + '/' + value;
        } else {
            return location.hash;
        }
    };
};