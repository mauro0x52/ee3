/** Region
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de regiões
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        Region = Model.Region;

    /** GET /regions
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todas as regiões
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {filterByName}
     * @response : {Name, Slug, CountryIds, StateIds, CityIds}
    */
    app.get('/regions/', function (request, response) {
        var filter;

        response.contentType('json');
        
        //Verifica se existe o filtro por nome e adiciona para implementar na query
        if (request.param('filterByName', null)) {
            filter.name = request.param('filterByName', null);
        }
        //Localiza a região com os filtros, caso exista
        Region.find(filter, function (error, regions) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({regions : regions});
            }
        });
    });

    /** GET /region/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista o país desejado
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {}
     * @response : {Name, Slug, CountryIds, StateIds, CityIds}
    */
    app.get('/region/:slug/', function (request, response) {
        response.contentType('json');

        //Localiza a região informada através do Slug
        Region.findOne({slug : request.params.slug}, function (error, region) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(region);
            }
        });
    });
};