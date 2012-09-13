/** Company
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de empresa
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company
     *
     * @autor : Rafael Erthal e Lucas Calado
     * @since : 2012-08
     *
     * @description : Cadastrar empresa
     *
     * @allowedApp : Companies
     * @allowedUser : Logado
     *
     * @request : {login,token,name,sectors,city,type,profile,tags,activity,abstract,about}
     * @response : {confirmation}
     */
    app.post('/company', function (request, response) {
        var company;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //Cria o Objeto Company para adicionar no Model
                company = new Company({
                    name       : request.param("name"),
                    members    : request.param("members"),
                    users      : [user._id],
                    sectors    : request.param("sectors"),
                    products   : request.param("products"),
                    addresses  : request.param("addresses"),
                    type       : request.param("type"),
                    profile    : request.param("profile"),
                    active     : request.param("active"),
                    tags       : request.param("tags"),
                    activity   : request.param("activity"),
                    abstract   : request.param("abstract"),
                    about      : request.param("about"),
                    phones     : request.param("phones"),
                    contacts   : request.param("contacts"),
                    links      : request.param("links"),
                    embeddeds  : request.param("embeddeds"),
                    dateCreated : new Date(),
                    dateUpdated : new Date()
                });
                //Salva o objeto no Model de Companies e retorna o objeto para o solicitante
                company.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(company);
                    }
                });
            }
        });
    });

    /** GET /companies
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar empresas
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {
                   limit, page, filterBySectors:{sectors, operator},
                   filterByCities:{sectors, operator}, order,
                   attributes :{members,products,addresses,about,embeddeds,phones,contacts,links}
                  }
     * @response : {[{slug,name,thumbnails,sectors,city,type,profile,tags,activity,abstract}]}
     */
    app.get('/companies', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var ObjectId = require('mongoose').Types.ObjectId,
            query, limit, from, to, order, findCompany,
            filterBySectors, filterBySectorsOperator, sectorsList,
            filterByCities, citiesList;


        findCompany = Company.find();

        // limit : padrao = 10, max = 20, min = 1
        limit = request.param('limit', 10) < 20 ? request.param('limit', 10) : 20;
        findCompany.limit(limit);

        // from : padrao = 0, min = 0
        from = limit * (request.param('page', 1) - 1);
        from = from >= 0 ? from : 0;
        findCompany.skip(from);

        // order : padrao = dateCreated descending
        order = request.param('order', [{dateCreated:-1}]);
        if (!(order instanceof Array)) order = [order];

        var sort = {};
        for (var i = 0; i < order.length; i++) {
            for (var name in order[i]) {
                sort[name] = order[i][name];
            }
        }
        findCompany.sort(sort);
        // filterBySectors
        filterBySectors = request.param('filterBySectors');

        if (filterBySectors && filterBySectors.sectors) {
            sectorsList = typeof filterBySectors.sectors === 'string' ? [filterBySectors.sectors] : filterBySectors.sectors;
            if (filterBySectors.operator === 'or') {
                findCompany.where('sectors').in(sectorsList);
            } else {
                findCompany.where('sectors').all(sectorsList);
            }
        }
        // filterByCities
        filterByCities = request.param('filterByCities');

        if (filterByCities && filterByCities.cities) {
            citiesList = typeof filterByCities.cities === 'string' ? [filterByCities.cities] : filterByCities.cities;
            if (filterByCities.operator === 'or') {
                findCompany.where('addresses.city').in(citiesList);
            } else {
                findCompany.where('addresses.city').all(citiesList);
            }
        }


        findCompany.exec(
            function (error, companies){
                if (error) {
                    response.send({error : error })
                } else {
                    response.send(companies);
                }
            }
        );
    });

    /** GET /companies/count
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Conta empresas
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {
                   limit, page, filterBySectors{sectors, levels, operator},
                   filterByCities, filterByStates,filterByCountries, order,
                   attributes :{members,products,addresses,badges,about ,embeddeds,phones,contacts,links}
                  }
     * @response : {[{limit,pages,total}]}
     */
    app.get('/companies/count', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var ObjectId = require('mongoose').Types.ObjectId,
            query, limit, from, to, order, countCompany,
            filterBySectors, filterBySectorsOperator, sectorsList,
            filterByCities, citiesList;


        countCompany = Company.count();

        // filterBySectors
        filterBySectors = request.param('filterBySectors');

        if (filterBySectors && filterBySectors.sectors) {
            sectorsList = typeof filterBySectors.sectors === 'string' ? [filterBySectors.sectors] : filterBySectors.sectors;
            if (filterBySectors.operator === 'or') {
                countCompany.where('sectors').in(sectorsList);
            } else {
                countCompany.where('sectors').all(sectorsList);
            }
        }
        // filterByCities
        filterByCities = request.param('filterByCities');

        if (filterByCities && filterByCities.cities) {
            citiesList = typeof filterByCities.cities === 'string' ? [filterByCities.cities] : filterByCities.cities;
            if (filterByCities.operator === 'or') {
                countCompany.where('addresses.city').in(citiesList);
            } else {
                countCompany.where('addresses.city').all(citiesList);
            }
        }

        countCompany.exec(
            function (error, count){
                if (error) {
                    response.send({error : error })
                } else {
                    response.send({count : count});
                }
            }
        );
    });

    /** GET /company/:slug
     *
     * @autor : Rafael Erthal e Lucas Calado
     * @since : 2012-08
     *
     * @description : Exibir empresa
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {attributes :{members,products,addresses,badges,about ,embeddeds,phones,contacts,links}}
     * @response : {slug,name,thumbnails,sectors,city,type,profile,tags,activity,abstract}
     */
    app.get('/company/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        var id = request.params.id,
            attributes = request.param('attributes', {}),
            token = request.param('token');

        //valida o token do usuário
        auth(token, function (user) {
            Company.findByIdentity(id, function(error, company) {
                if (error) {
                    response.send({error : error});
                } else {
                    //verifica se a compania foi encontrada
                    if (company === null) {
                        response.send({error : 'company not found'});
                    } else {
                        if (!attributes.products) company.products = undefined;
                        if (!attributes.addresses || !user) {
                            for (var i in company.addresses) {
                                company.addresses[i].street = undefined;
                                company.addresses[i].number = undefined;
                                company.addresses[i].complement = undefined;
                            }
                        }
                        if (!attributes.about) company.about = undefined;
                        if (!attributes.embeddeds) company.embeddeds = undefined;
                        if (!attributes.phones || !user) company.phones = undefined;
                        if (!attributes.contacts || !user) company.contacts = undefined;
                        if (!attributes.links) company.links = undefined;
                        if (attributes.members) {

                        }
                        response.send(company);
                    }
                }
            });
        });

    });

    /** PUT /company/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,name,sectors,city,type,profile,tags,activity,abstract,about}
     * @response : {confirmation}
     */
    app.put('/company/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.params.id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : 'company not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDenied'}});
                            } else {
                                //Valida cada campo para ver se existe e trata para adicionar no Model
                                company.slug        = request.param("slug", company.slug);
                                company.name        = request.param("name", company.name);
                                company.thumbnails  = request.param("thumbnails", company.thumbnails);
                                company.members     = request.param("members", company.members);
                                company.users       = request.param("users", company.users);
                                company.sectors     = request.param("sectors", company.sectors);
                                company.products    = request.param("products", company.products);
                                company.addresses   = request.param("addresses", company.addresses);
                                company.type        = request.param("type", company.type);
                                company.profile     = request.param("profile", company.profile);
                                company.active      = request.param("active", company.active);
                                company.addresses   = request.param("addresses", company.addresses);
                                company.tags        = request.param("tags", company.tags);
                                company.activity    = request.param("activity", company.activity);
                                company.abstract    = request.param("abstract", company.abstract);
                                company.about       = request.param("about", company.about);
                                company.phones      = request.param("phones", company.phones);
                                company.contacts    = request.param("contacts", company.contacts);
                                company.links       = request.param("links", company.links);
                                company.embeddeds   = request.param("embeddeds", company.embeddeds);

                                company.dateUpdated = new Date();
                                //Salva o objeto no Model de Companies e retorna o objeto para o solicitante
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(company);
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** DEL /company/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:id', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.params.id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : 'company not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDenied'}});
                            } else {
                                //remove a compania
                                company.remove(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
                                    }
                                });
                            }
                        }
                    }
                });
            } 
        });
    });
};
