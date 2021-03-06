/** City
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de cidades
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        City  = Model.City,
        Country = Model.Country,
        State = Model.State,
        Region = Model.Region;

    /** GET /country/:slugCountry/state/:slugState/cities
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todas as cidades
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {limit, order, page}
     * @response : {Name, DDD, Slug}
     */
    app.get('/country/:slugCountry/state/:slugState/cities', function (request, response) {
        var filter = {},
            filterState = {},
            limit, order, query, from;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //Valida o slug do país
        Country.findByIdentity(request.params.slugCountry, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                //Com o resultado da validação do país, valida o slug do estado.
                if (country) {
                    //Localiza o Estado
                    State.findByIdentity(request.params.slugState, country._id, function (error, state) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //Com o resultado da validação do estado, faz a busca de todas as cidades.
                            if (state) {
                                //Aplica o filtro de estado
                                filter.state = state._id;

                                //Cria o objeto query
                                query = City.find(filter);

                                limit = request.param('limit');
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

                                //Faz a busca das cidades.
                                query.exec(function (error, cities) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({cities : cities});
                                    }
                                });
                            } else {
                                response.send({error : { message : 'state not found', name : 'NotFoundError', id : request.params.stateSlug, path : 'state'}});
                            }
                        }
                    });
                } else {
                    response.send({error : { message : 'country not found', name : 'NotFoundError', id : request.params.countrySlug, path : 'country'}});
                }
            }
        });
    });

    /** GET /country/:slugCountry/state/:slugState/city/:slugCity
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista a cidade desejada
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slugCountry,slugState,slugCity}
     * @response : {Name, DDD, Slug}
     */
    app.get('/country/:slugCountry/state/:slugState/city/:slugCity', function (request, response) {
    	var filter;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        Country.findByIdentity(request.params.slugCountry, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    //Localiza o Estado
                    State.findByIdentity(request.params.slugState, country._id, function (error, state) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            if (state) {
                                //Localiza a Cidade com os filtros informados
                                City.findByIdentity(request.params.slugCity, state._id, function (error, city) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        if (city) {
                                            response.send({city : city});
                                        } else {
                                            response.send({error : { message : 'city not found', name : 'NotFoundError', id : request.params.citySlug, path : 'city'}});
                                        };
                                    }
                                });
                            } else {
                                response.send({error : { message : 'state not found', name : 'NotFoundError', id : request.params.stateSlug, path : 'state'}});
                            }
                        }
                    });
                } else {
                    response.send({error : { message : 'country not found', name : 'NotFoundError', id : request.params.countrySlug, path : 'country'}});
                }
            }
        });
    });

    /** GET /city/:id
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista a cidade desejada pegando com referência o ID
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {id}
     * @response : {Name, DDD, Slug}
     */
    app.get('/city/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        City.findById(request.params.id, function (error, city) {
            if (error) {
                response.send({error : error});
            } else {
                if (city) {
                    State.findById(city.state, function(error, state) {
                        if (state) {
                            response.send({city : city, state : state});
                        }
                        else {
                            response.send({error : { message : 'state not found', name : 'NotFoundError', id : request.params.stateSlug, path : 'state'}});
                        }
                    })
                } else {
                    response.send({error : { message : 'city not found', name : 'NotFoundError', id : request.params.citySlug, path : 'city'}});
                };
            }
        });
    });
};