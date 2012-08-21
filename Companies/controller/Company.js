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

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
            } else {
                response.send({error : 'invalid token'});
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
                   limit, page, filterBySectors, filterBySectorsOperator},
                   filterByCities, filterByStates,filterByCountries, order,
                   attributes :{members,products,addresses,badges,about ,embeddeds,phones,contacts,links}
                  }
     * @response : {[{slug,name,thumbnails,sectors,city,type,profile,tags,activity,abstract}]}
     */
    app.get('/companies', function (request, response) {
        response.contentType('json');

        var ObjectId = require('mongoose').Types.ObjectId,
            query, limit, from, to, order, findCompany,
            filterBySectors, filterBySectorsOperator, sectorsList,
            filterByCities, citiesList;


        findCompany = Company.find();

        // limit : padrao = 10, max = 20, min = 1
        limit = parseInt(request.query['limit']) > 0 ? parseInt(request.query['limit']) : 10;
        limit = limit < 20 ? limit : 20;
        findCompany.limit(limit);

        // from : padrao = 0, min = 0
        from = limit * (parseInt(request.query['page']) - 1);
        from = from >= 0 ? from : 0;
        findCompany.skip(from);

        // order : padrao = dateCreated descending
        order = request.query['order'] ? request.query['order'] : ['dateCreated',-1];
        for (var i = 0; i < order.length; i = i+2) {
            findCompany.sort(order[i],parseInt(order[i+1]));
        }

        // filterBySectors
        filterBySectors = request.query['filterBySectors'];
        filterBySectorsOperator = request.query['filterBySectorsOperator'] ? request.query['filterBySectorsOperator'].toLowerCase() : 'and';

        if (filterBySectors) {
            sectorsList = typeof filterBySectors === 'string' ? [filterBySectors] : filterBySectors;
            for (var i in sectorsList) {
                sectorsList[i] = parseInt(sectorsList[i])
            }
            if (filterBySectorsOperator === 'and') {
                findCompany.where('sectors').all(sectorsList);
            } else {
                findCompany.where('sectors').in(sectorsList);
            }
        }
        // filterByCities
        filterByCities = request.query['filterByCities'];
        if (filterByCities) {
            citiesList = typeof filterByCities === 'string' ? [filterByCities] : filterByCities;
            findCompany.where('cities').in(citiesList);
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

        var id = request.params.id,
            attributes = request.query['attributes'],
            token = request.query['token'];

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
                        if (!attributes || attributes.indexOf("products") < 0) company.products = undefined;
                        if (!attributes || attributes.indexOf("addresses") < 0 || !user) company.addresses = undefined;
                        if (!attributes || attributes.indexOf("about") < 0) company.about = undefined;
                        if (!attributes || attributes.indexOf("embeddeds") < 0) company.embeddeds = undefined;
                        if (!attributes || attributes.indexOf("phones") < 0 || !user) company.phones = undefined;
                        if (!attributes || attributes.indexOf("contacts") < 0 || !user) company.contacts = undefined;
                        if (!attributes || attributes.indexOf("links") < 0) company.links = undefined;
                        if (attributes && attributes.indexOf("members") >= 0) {

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

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                            if (! company.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //Valida cada campo para ver se existe e trata para adicionar no Model
                                if (request.param("slug")) {
                                    company.slug = request.param("slug");
                                }
                                if (request.param("name")) {
                                    company.name = request.param("name");
                                }
                                if (request.param("thumbnails")) {
                                    company.thumbnails = request.param("thumbnails");
                                }
                                if (request.param("members")) {
                                    company.members = request.param("members");
                                }
                                if (request.param("users")) {
                                    company.users = request.param("users");
                                }
                                if (request.param("sectors")) {
                                    company.sectors = request.param("sectors");
                                }
                                if (request.param("products")) {
                                    company.products = request.param("products");
                                }
                                if (request.param("addresses")) {
                                    company.addresses = request.param("addresses");
                                }
                                if (request.param("type")) {
                                    company.type = request.param("type");
                                }
                                if (request.param("profile")) {
                                    company.profile = request.param("profile");
                                }
                                if (request.param("active")) {
                                    company.active = request.param("active");
                                }
                                if (request.param("tags")) {
                                    company.tags = request.param("tags");
                                }
                                if (request.param("abstract")) {
                                    company.abstract = request.param("abstract");
                                }
                                if (request.param("about")) {
                                    company.about = request.param("about");
                                }
                                if (request.param("phones")) {
                                    company.phones = request.param("phones");
                                }
                                if (request.param("contacts")) {
                                    company.contacts = request.param("contacts");
                                }
                                if (request.param("links")) {
                                    company.links = request.param("links");
                                }
                                if (request.param("embeddeds")) {
                                    company.embeddeds = request.param("embeddeds");
                                }

                                company.dateUpdated = new Date();

                                //Salva o objeto no Model de Companies e retorna o objeto para o solicitante
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({company : company});
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
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

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                            if (! company.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //remove a compania
                                company.remove(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({error : ''});
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
};