/*global escape: false, sdk: false, XMLHttpRequest: false, XDomainRequest: false, window: false */

/** AJAX
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de chamadas assincronas ao servidor
 * @param app : contexto em que os callbacks serão executados
 */
sdk.modules.ajax = function (app) {
    "use strict";

    /** get
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    this.get = function (path, cb) {
        ajaxRequest(path.url, 'GET', jsonToQuery(path.data), function (data) {
            cb.apply(app, [data]);
        });
    };

    /** getJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método GET
     */
    this.getJSON = function (path, cb) {
        ajaxRequest(path.url, 'GET', jsonToQuery(path.data), function (data) {
            cb.apply(app, [eval('(' + data + ')')]);
        });
    };

    /** post
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    this.post = function (path, cb) {
        ajaxRequest(path.url, 'POST', jsonToQuery(path.data), function (data) {
            cb.apply(app, [data]);
        });
    };

    /** postJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método POST
     */
    this.postJSON = function (path, cb) {
        ajaxRequest(path.url, 'POST', jsonToQuery(path.data), function (data) {
            cb.apply(app, [eval('(' + data + ')')]);
        });
    };

    /** put
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    this.put = function (path, cb) {
        ajaxRequest(path.url, 'PUT', jsonToQuery(path.data), function (data) {
            cb.apply(app, [data]);
        });
    };

    /** putJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método PUT
     */
    this.putJSON = function (path, cb) {
        ajaxRequest(path.url, 'PUT', jsonToQuery(path.data), function (data) {
            cb.apply(app, [eval('(' + data + ')')]);
        });
    };

    /** del
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    this.del = function (path, cb) {
        ajaxRequest(path.url, 'DELETE', jsonToQuery(path.data), function (data) {
            cb.apply(app, [data]);
        });
    };

    /** delJSON
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : realiza chamada CORS com método DELETE
     */
    this.delJSON = function (path, cb) {
        ajaxRequest(path.url, 'DELETE', jsonToQuery(path.data), function (data) {
            cb.apply(app, [eval('(' + data + ')')]);
        });
    };
};