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
        var filter = {},
            where = {};

        response.contentType('json');

        if (request.param('filterByName', null)) {
            filter.name = request.param('filterByName', null);
        }

        if (request.param('filterByRegion', null)) {
            Region.findOne({slug : request.param('filterByRegion', null)}, function (error, region) {
                var query = Country.find(filter);

                query.where("regionIds");
                query.in([region._id]);

                query.exec(function (error, countries) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({countries : countries});
                    }
                });
            });
        } else {
            Country.find(filter, function (error, countries) {
                if (error) {
                    response.send({error : error});
                } else {
                    response.send({countries : countries});
                }
            });
        }
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

        Country.findOne({slug : request.params.slug}, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(country);
            }
        });
    });
};