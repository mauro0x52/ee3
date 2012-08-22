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
     * @request : {}
     * @response : {Name, DDD, Slug}
     */
    app.get('/country/:slugCountry/state/:slugState/cities/', function (request, response) {
        var filter = {},
            filterState = {};

        response.contentType('json');

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
                                filter.stateId = state._id;
                                //Faz a busca das cidades.
                                City.find(filter, function (error, cities) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({cities : cities});
                                    }
                                });
                            } else {
                                response.send({error : "state not found."});
                            }
                        }
                    });
                } else {
                    response.send({error : "country not found."});
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
    app.get('/country/:slugCountry/state/:slugState/city/:slugCity/', function (request, response) {
        var filter;

        response.contentType('json');

        Country.findOne({slug : request.params.slugCountry}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    //Adiciona os Filtros necessários para localizar o Estado
                    filter = {countryId : country._id, slug : request.params.slugState};
                    //Localiza o Estado
                    State.findOne(filter, function (error, state) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            if (state) {
                                //Aplica os filtros necessários para localizar a cidade
                                filter = {stateId : state._id, slug : request.params.slugCity};
                                //Localiza a Cidade com os filtros informados
                                City.findOne(filter, function (error, city) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        if (city) {
                                            response.send({City : city});
                                        } else {
                                            response.send({error : "city not found."});
                                        };
                                    }
                                });
                            } else {
                                response.send({error : "state not found."});
                            }
                        }
                    });
                } else {
                    response.send({error : "country not found."});
                }
            }
        });
    });
};