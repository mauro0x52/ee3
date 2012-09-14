/*global escape: false, sdk: false, XMLHttpRequest: false, XDomainRequest: false, window: false */

/** AJAX
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de chamadas assincronas ao servidor
 */
sdk.modules.ajax = function (app) {
    "use strict";

    var parseQuery,
        call;

    /** parseQuery
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : converte um objeto jSon em query
     */
    parseQuery = function (obj, label) {
        var query_string = "",
            key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] !== 'object') {
                    query_string += (label ? label + "[" + escape(key) + "]" : escape(key)) + '=' + escape(obj[key]) + '&';
                } else {
                    query_string += parseQuery(obj[key], (label ? label + "[" + key + "]" : key)) + '&';
                }
            }
        }
        return query_string.slice(0, query_string.length - 1);
    };

    /** call
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS
     */
    call = function (cb, JSON) {
        var invocation;

        try {
            if (window.XDomainRequest) {
                invocation = new XDomainRequest();
            } else {
                invocation = new XMLHttpRequest();
            }
            if (invocation) {
                invocation.onload = function () {
                    if (app.cb) {
                        app.cb(invocation.responseText);
                    } else {
                        if (JSON) {
                            cb.apply(app, [eval("(" + invocation.responseText + ")")]);
                        } else {
                            cb.apply(app, [invocation.responseText]);
                        }
                    }
                };
                invocation.onerror = function (error) {
                    console.log(error);
                };
            } else {
                console.error('unable to create request object');
            }
            return invocation;
        } catch (error) {
            console.error(JSON.stringify(error));
        }
    };

    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    this.get = function (path, cb) {
        var caller = call(cb);

        caller.open('GET', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** getJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    this.getJSON = function (path, cb) {
        var caller = call(cb, true);

        caller.open('GET', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** post
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    this.post = function (path, cb) {
        var caller = call(cb);

        caller.open('POST', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** postJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    this.postJSON = function (path, cb) {
        var caller = call(cb, true);

        caller.open('POST', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** put
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    this.put = function (path, cb) {
        var caller = call(cb);

        caller.open('PUT', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** putJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    this.putJSON = function (path, cb) {
        var caller = call(cb, true);

        caller.open('PUT', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** del
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    this.del = function (path, cb) {
        var caller = call(cb);

        caller.open('DELETE', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };

    /** delJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    this.delJSON = function (path, cb) {
        var caller = call(cb, true);

        caller.open('DELETE', path.url + "?" + parseQuery(path.data), true);
        caller.send();
    };
};