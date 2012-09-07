/*global sdk: false*/

/** Route
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de rotas do navegador
 */
sdk.modules.route = function (app) {
    var routes = [];

    /** match
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : verifica se a url bate com a mascara
     * @param url : url a ser checada
     * @param mask : mascara da url
     */
    var match = function (url, mask) {
        var maskSlices = mask.split('/'),
            urlSlices = url.split('/');

        if (maskSlices.length === urlSlices) {
            for (var i = 0; i < maskSlices.length ; i++) {
                if (maskSlices[i] !== urlSlices[i] && maskSlices[i].substring(0, 1) !== ':') {
                    return false;
                }
            }
        } else {
            return false;
        }

        return true;
    };

    /** params
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : pega os parâmetros de uma mascara na url
     * @param url : url a ser checada
     * @param mask : mascara da url
     */
    var params = function (url, mask) {
        var maskSlices = mask.split('/'),
            urlSlices = url.split('/'),
            params = {};

        for (var i = 0; i < maskSlices.length ; i++) {
            if (maskSlices[i].substring(0, 1) === ':') {
                params[maskSlices[i].substring(1)] = urlSlices[i]
            }
        }

        return params;
    };

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
    var path = function (value) {
        if (value) {
            location.hash = '!/' + app.slug + '/' + value;
        } else {
            var regex = /#!\/[a-z,0-9,-]+\/([a-z,0-9,\-,\/]+[a-z,0-9])/;
            return regex.exec(location.hash)[1];
            //return location.hash.replace(/\#\!\/[a-z,A-Z,0-9,\-]+\//, '').replace(/\?.+/, '').split('/');
        }
    };

    /** query
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : seta ou retorna a parte da url após o #!/app-name/*
     * @param value : valor a ser setado
     */
    var query = function (value) {
        if (value) {
            this.path(path() + '?' + parseQuery(value));
        } else {
            var res = {};
            location.hash.replace(/#!\/[a-z,0-9,-]+\/[a-z,0-9,\-,\/]+[a-z,0-9]\/?\??/, '')
                .replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"),
                    function ($0, $1, $2, $3) {res[$1] = $3;}
                );
            return res;
        }
    };

    /** fit
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : coloca na pilha uma rota com url e callback
     * @param route : rota a ser colocada
     * @param callback : função a ser chamada caso a url bata
     */
    this.fit = function (route, callback) {
        var url = path();

        routes.push({route : route, callback : callback});
        if (match(url, route)) {
            callback.apply(app, [params(url, route), query]);
        }
    };

    /** go
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : go
     * @param route : rota a ser colocada
     * @param data : dados a serem postos na query string
     */
    this.go = function (url, data) {
        path(url);
        query(data);

        for (var i = 0; i < routes.length; i++) {
            if (match(url, routes[i].route)) {
                return routes[i].callback.apply(app, [params(url, routes[i].route), query]);
            }
        }

        throw 'not found';
    };
};