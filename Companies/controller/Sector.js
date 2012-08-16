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
        
        Sector.find({}, function (error, sectors) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(sectors);
            }
        })
    });


     /** GET /sector/:id
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Dados de um setor
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Deslogado
     *
     * @request : {id}
     * @response : {sector}
     */
    app.get('/sector/:id', function (request,response) {
        response.contentType('json');

        Sector.findByIdentity(request.params.id, function (error, sector) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(sector);
            }
        })
    });
};