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
     * @request : {order, limit, page}
     * @response : {Name, Slug, CountryIds, StateIds, CityIds}
    */
    app.get('/regions/', function (request, response) {
        response.contentType('json');
        
        var limit, order, findRegion;
        
        findRegion = Region.find();
        
        // limit : padrao = 10, max = 20, min = 1
        limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
        findRegion.limit(limit);
        
        // order : padrao = dateCreated descending
        order = request.param('order', [{name:1}]);
        if (!(order instanceof Array)) order = [order];

        var sort = {};
        for (var i = 0; i < order.length; i++) {
            for (var name in order[i]) {
                sort[name] = order[i][name];
            }
        }
        findRegion.sort(sort);
        
        //Localiza todas as regiões
        findRegion.exec (function (error, regions) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(regions);
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
        Region.findByIdentity(request.params.slug, function (error, region) {
            if (error) {
                response.send({error : error});
            } else {
                if (region) {
                    response.send(region);
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
     * @request : {slugRegion, limit, order, page}
     * @response : {Name, Acronym, DDI, Slug}
    */
    app.get('/region/:slugRegion/countries', function (request, response) {
        var filter = {},
            where = {},
            limit, order, query, from;

        response.contentType('json');
        
        //Localiza a Região pelo nome
        Region.findByIdentity(request.params.slugRegion, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar os Países
                query = Country.find();

                // limit : padrao = 10, max = 20, min = 1
                limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
                query.limit(limit);

                // order : padrao = dateCreated descending
		        order = request.param('order', [{name:1}]);
		        if (!(order instanceof Array)) order = [order];
		
		        var sort = {};
		        for (var i = 0; i < order.length; i++) {
		            for (var name in order[i]) {
		                sort[name] = order[i][name];
		            }
		        }
		        query.sort(sort);
                
                // from : padrao = 0, min = 0
                from = limit * (request.param('page', 1) - 1);
                from = from >= 0 ? from : 0;
                query.skip(from);
                
                query.where("regions");
                query.in([region._id]);
                //Localiza os Países 
                query.exec(function (error, countries) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(countries);
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
     * @request : {slugRegion, limit, order, page}
     * @response : {Name, Slug}
    */
    app.get('/region/:slugRegion/states', function (request, response) {
        var filter = {},
            where = {},
            limit, order, query, from;

        response.contentType('json');
        
        //Localiza a Região pelo nome
        Region.findByIdentity(request.params.slugRegion, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar os Estados
                query = State.find();
                
                // limit : padrao = 10, max = 20, min = 1
                limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
                query.limit(limit);

                // order : padrao = dateCreated descending
		        order = request.param('order', [{name:1}]);
		        if (!(order instanceof Array)) order = [order];
		
		        var sort = {};
		        for (var i = 0; i < order.length; i++) {
		            for (var name in order[i]) {
		                sort[name] = order[i][name];
		            }
		        }
		        query.sort(sort);
                
                // from : padrao = 0, min = 0
                from = limit * (request.param('page', 1) - 1);
                from = from >= 0 ? from : 0;
                query.skip(from);
                
                query.where("regions");
                query.in([region._id]);
                //Localiza os Estados 
                query.exec(function (error, states) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(states);
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
     * @request : {slugRegion, limit, order, page}
     * @response : {Name, Slug}
    */
    app.get('/region/:slugRegion/cities', function (request, response) {
        var filter = {},
            where = {},
            limit, order, query, from;

        response.contentType('json');
        
        //Localiza a Região pelo nome
        Region.findByIdentity(request.params.slugRegion, function (error, region) {
            //Verifica se existe a região e retorna erro caso não exista
            if (region) {
                //Cria a query com os dados da região para buscar as Cidades
                query = City.find();
                
                // limit : padrao = 10, max = 20, min = 1
                limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
                query.limit(limit);

                // order : padrao = dateCreated descending
		        order = request.param('order', [{name:1}]);
		        if (!(order instanceof Array)) order = [order];
		
		        var sort = {};
		        for (var i = 0; i < order.length; i++) {
		            for (var name in order[i]) {
		                sort[name] = order[i][name];
		            }
		        }
		        query.sort(sort);
                
                // from : padrao = 0, min = 0
                from = limit * (request.param('page', 1) - 1);
                from = from >= 0 ? from : 0;
                query.skip(from);
                
                query.where("regions");
                query.in([region._id]);
                //Localiza as Cidades
                query.exec(function (error, cities) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(cities);
                    }
                });
            } else {
                response.send({error : "region not found."});
            }
        });
    });
};