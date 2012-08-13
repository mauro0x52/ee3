/** Country
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de países
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        Country  = Model.Country,
        Region = Model.Region;

    /** GET /countries
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos os países
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {filterByName, filterByRegion}
     * @response : {Name, Acronym, DDI, Slug}
    */
    app.get('/countries/', function (request, response) {
        response.contentType('json');
        
        //Localiza os Países com filtros simples
        Country.find(function (error, countries) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({countries : countries});
            }
        });
    });
    
    /** GET /contry/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista o país desejado
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slug}
     * @response : {Name, Acronym, DDI, Slug}
     */
    app.get('/country/:slug/', function (request, response) {
        response.contentType('json');
        
        //Localiza o País desejado e retorna os dados informados
        Country.findOne({slug : request.params.slug}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    response.send(country);
                } else {
                    response.send({error : "country not found."});
                }
            }
        });
    });
};