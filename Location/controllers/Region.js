/** Country
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de regiões
 */
 
module.exports = function (app) {
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
    app.get('/regions/', function (request,response) {
        response.contentType('json');
        
        if (request.param('filterByName', null)) {
            filter.name = request.param('filterByName', null);
        }
        Region.find(filter, function (error,regions) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({regions : regions});
            }
        })
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
    app.get('/region/:slug/', function (request, response){
        response.contentType('json');
        
        Region.findOne({slug : request.params.slug}, function (error, region) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(region);
            }
        })
    });
};