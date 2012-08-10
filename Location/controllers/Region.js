/** Region
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de regiões
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        Region = Model.Region,
        Country = Model.Country;

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
     * @request : {}
     * @response : {Name, Slug, CountryIds, StateIds, CityIds}
    */
    app.get('/regions/', function (request, response) {
        response.contentType('json');
        
        //Localiza todas as regiões
        Region.find( function (error, regions) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({Regions : regions});
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
            if (region) {
                if (error) {
                    response.send({error : error});
                } else {
                    response.send({Region : region});
                }
            } else {
                response.send({error : "region not found."});
            }
            
        });
    });
    
    /** GET /countries
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos os países por região
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slugRegion}
     * @response : {Name, Acronym, DDI, Slug}
    */
    app.get('/region/:slugRegion/countries', function (request, response) {
        var filter = {},
            where = {};

        response.contentType('json');
        
        //Aplica filtro por região caso exista
        if (request.params.region) {
            //Localiza a Região pelo nome
            Region.findOne({"slugRegion" : request.params.region}, function (error, region) {
                //Verifica se existe a região e retorna erro caso não exista
                if (region) {
                    //Cria a query com os dados da região para buscar os Países
                    var query = Country.find();
                    query.where("regionIds");
                    query.in([region._id]);
                    //Localiza o Países com todos os filtros 
                    query.exec(function (error, countries) {
                        if (countries) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({countries : countries});
                            }
                        } else {
                            response.send({error : "countries not found."});
                        }
                    });
                } else {
                    response.send({error : "region not found."});
                }
            });
        }
    });
};