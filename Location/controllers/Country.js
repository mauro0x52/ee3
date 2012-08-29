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
    app.get('/countries', function (request, response) {
        response.contentType('json');
        var limit, order, query, from;

        //Cria o objeto query
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

        //Localiza os Países com filtros simples
        query.exec(function (error, countries) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(countries);
            }
        });
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
    app.get('/country/:slug', function (request, response) {
        response.contentType('json');
        
        //Localiza o País desejado e retorna os dados informados
        Country.findByIdentity(request.params.slug, function (error, country) {
            if (error) {
                response.send({error : error});
            } else {
                if (country) {
                    response.send(country);
                } else {
                    response.send({error : "country not found."});
                }
            }
        });
    });
};