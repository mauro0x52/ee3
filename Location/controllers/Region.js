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
        Country = Model.Country,
        State = Model.State,
        City = Model.City;

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
     * @description : Lista a região desejada
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
                if (region) {
                    response.send({Region : region});
                } else {
                    response.send({error : "region not found."});
                }
            }
        });
    });
    
    /** GET /region/:slugRegion/countries
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos os países de uma região
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
        
        //Localiza a Região pelo nome
        Region.findOne({"slug" : request.params.slugRegion}, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar os Países
                var query = Country.find();
                query.where("regionIds");
                query.in([region._id]);
                //Localiza os Países 
                query.exec(function (error, countries) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({Countries : countries});
                    }
                });
            } else {
                response.send({error : "region not found."});
            }
        });
    });
    
    /** GET /region/:slugRegion/states
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos os estados de uma região
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slugRegion}
     * @response : {Name, Slug}
    */
    app.get('/region/:slugRegion/states', function (request, response) {
        var filter = {},
            where = {};

        response.contentType('json');
        
        //Localiza a Região pelo nome
        Region.findOne({"slug" : request.params.slugRegion}, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar os Estados
                var query = State.find();
                query.where("regionIds");
                query.in([region._id]);
                //Localiza os Estados 
                query.exec(function (error, states) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({States : states});
                    }
                });
            } else {
                response.send({error : "region not found."});
            }
        });
    });
    
    /** GET /region/:slugRegion/cities
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos as cidades de uma região
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slugRegion}
     * @response : {Name, Slug}
    */
    app.get('/region/:slugRegion/cities', function (request, response) {
        var filter = {},
            where = {};

        response.contentType('json');
        
        //Localiza a Região pelo nome
        Region.findOne({"slug" : request.params.slugRegion}, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar as Cidades
                var query = City.find();
                query.where("regionIds");
                query.in([region._id]);
                //Localiza as Cidades
                query.exec(function (error, cities) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({Cities : cities});
                    }
                });
            } else {
                response.send({error : "region not found."});
            }
        });
    });
};