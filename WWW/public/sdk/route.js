/*global sdk: false*/

/** Route
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de rotas do navegador
 */
sdk.modules.route = function (app) {
    /** parseQuery
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : converte um objeto jSon em query
     */
    var parseQuery = function (obj, label) {
        var query_string = "",
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] !== 'object') {
                    query_string += (label ? label + "." : "") + escape(key) + '=' + escape(obj[key]) + '&';
                } else {
                    query_string += parseQuery(obj[key], (label ? label + "." : "") + key) + '&';
                }
            }
        }
        return query_string.slice(0, query_string.length - 1);
    };

    /** path
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : seta ou retorna a parte da url após o #!/app-name/*
     * @param value : valor a ser setado
     */
    this.path = function (value) {
        if (value) {
            location.hash = '!/' + app.slug + '/' + value;
        } else {
            return location.hash.replace(/\#\!\/[a-z,A-Z,0-9,\-]+\//, '').replace(/\?.+/, '').split('/');
        }
    };

    /** path
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : seta ou retorna a parte da url após o #!/app-name/*
     * @param value : valor a ser setado
     */
    this.query = function (value) {
        if (value) {
            this.path(this.path().join('/') + '?' + parseQuery(value));
        } else {
            var res = {};
            location.hash.replace(/.+\?/, '').replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {res[$1] = $3;});
            return res;
        }
    };
};