/** Country
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de países
 */
 
module.exports = function (app) {
    
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
     * @request : {filterByName, filterByRegion}
     * @response : {Name, Slug}
     */
    app.get('/country/:slug/states/', function (request,response) {
        var filter = {};
        response.contentType('json');
        
        Country.findOne({slug:request.params.slug}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    filter = {countryId:country._id};
                    
                    State.find(filter, function (error,states) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({states : states});
                        }
                    })
                }
            }
        })
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
    app.get('/country/:slugCountry/state/:slugState', function (request, response){
        response.contentType('json');
        
        Country.findOne({slug:request.params.slugCountry}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    filter = {countryId:country._id,slug:request.params.slugState};
                    
                    State.findOne(filter, function (error,state) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({states : state});
                        }
                    })
                }
            }
        })
    });
};