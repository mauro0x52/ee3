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

        //Localiza o País informado pelo slug
        Country.findOne({slug : request.params.slug}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    //Localiza todos os estados do país informado
                    State.find({countryId : country._id}, function (error, states) {
                        if (states) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({States : states});
                            }
                        } else { 
                            response.send({error : "states not found."});
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
        Country.findOne({slug : request.params.slugCountry}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    //Adiciona os filtros necessários para encontrar o estado
                    filter = {countryId : country._id, slug : request.params.slugState};
                    //Localiza o estado
                    State.findOne(filter, function (error, state) {
                        if (state) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({State : state});
                            }
                        } else {
                            response.send({error : "state not found."});
                        }
                    });
                } else {
                    response.send({error : "country not found."});
                }
            }
        });
    });
};