/** Conversant
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades do sdk
 */

module.exports = function (app) {
    "use strict";

    /** GET /
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Enviar core do sdk
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {}
     */
    app.get('/', function (request, response) {
        response.sendfile('public/sdk.js');
    });
};