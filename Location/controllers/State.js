/** State
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de estados
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        State  = Model.State,
        Country = Model.Country;

    /** GET /states
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista todos os estados
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {}
     * @response : {Name, Slug}
     */
    app.get('/country/:slug/states/', function (request, response) {
        response.contentType('json');
        var filter = {},
            limit, order, query, from;

        //Localiza o País informado pelo slug
        Country.findByIdentity(request.params.slug, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    filter.countryId = country._id;
                    
                    //Cria o objeto query
                    query = State.find(filter);

                    // limit : padrao = 10, max = 20, min = 1
                    limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
                    query.limit(limit);

                    // order : padrao = name ascedenting
                    order = request.param('order', [{name:1}]);
                    if (!(order instanceof Array)) order = [order];

                    for (var i = 0; i < order.length; i++) {
                        for (var name in order[i]) {
                            query.sort(name,order[i][name]);
                        }
                    }

                    // from : padrao = 0, min = 0
                    from = limit * (request.param('page', 1) - 1);
                    from = from >= 0 ? from : 0;
                    query.skip(from);
                    
                    //Localiza todos os estados do país informado
                    query.exec(function (error, states) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send(states);
                        }
                    });
                } else {
                    response.send({error : "country not found."});
                }
            }
        });
    });

    /** GET /contry/:slugCountry/state/:slugState
     *
     * @autor : Lucas Kalado
     * @since : 2012-07
     *
     * @description : Lista o estado desejado
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Público
     *
     * @request : {slugCountry,slugState}
     * @response : {Name, Slug}
     */
    app.get('/country/:slugCountry/state/:slugState', function (request, response) {
        var filter;

        response.contentType('json');

        //Localiza o País enviado por slug
        Country.findByIdentity(request.params.slugCountry, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    //Adiciona os filtros necessários para encontrar o estado
                    filter = {countryId : country._id, slug : request.params.slugState};
                    //Localiza o estado
                    State.findByIdentity(filter, function (error, state) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            if (state) {
                                response.send(state);
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