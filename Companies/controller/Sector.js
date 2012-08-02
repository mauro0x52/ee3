/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de sector
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Sector  = Model.Sector;

    /** GET /sectors
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar setores
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {levels}
     * @response : {[{name,slug,children[]}]}
     */
    app.get('/sectors', function (request, response) {
        var plugin;

        response.contentType('json');
        
        Sector.findRecursively(request.param('levels', null), function (error, sectors) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({sectors : sectors});
            }
        })
    });

    /** GET /sector/{slug}/parent
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Pai de um setor setor
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {levels}
     * @response : {name,slug,children[]}
     */
    app.get('/sector/:slug/parent', function (request,response) {
        response.contentType('json');

        //TODO implementar funcionalidades
    });

     /** GET /sector/:slug/children
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Filhos de um setor setor
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {levels}
     * @response : {[{name,slug,children[]}]}
     */
    app.get('/sector/:slug/children', function (request,response) {
        response.contentType('json');

        //TODO implementar funcionalidades
    });

     /** GET /sector/:slug/path
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Caminho completo de um setor
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {levels}
     * @response : {path}
     */
    app.get('/sector/:slug/path', function (request,response) {
        response.contentType('json');

        //TODO implementar funcionalidades
    });
};