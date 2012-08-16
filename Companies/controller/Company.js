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
                    embeddeds  : request.param("embeddeds")
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
                   limit, page, filterBySectors{sectors, levels, operator},
                   filterByCities, filterByStates,filterByCountries, order,
                   attributes :{members,products,addresses,badges,about ,embeddeds,phones,contacts,links}
                  }
     * @response : {[{slug,name,thumbnails,sectors,city,type,profile,tags,activity,abstract}]}
     */
    app.get('/companies', function (request, response) {
        response.contentType('json');

        Company.find()
        .limit(request.param('limit', 10) < 20 ? request.param('limit', 10) : 20)
        .exec(
        	function (error, companies){
	            if (error) {
	                response.send({error : error })
	            } else {
	                response.send(companies);
	            }
        	}
        )
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
			attributes = request.param('attributes', {});


        //valida o token do usuário
        auth(request.param('token', null), function (user) {

	        Company.findByIdentity(id, function(error, company) {
	            if (error) {
	                response.send({error : error});
	            } else {
	                //verifica se a compania foi encontrada
	                if (company === null) {
	                    response.send({error : 'company not found'});
	                } else {
						if (!attributes.products) delete company.products;
						if (!attributes.addresses || !user) delete company.addresses;
						if (!attributes.about) delete company.about;
						if (!attributes.embeddeds) delete company.embeddeds;
						if (!attributes.phones || !user) delete company.phones;
						if (!attributes.contacts || !user) delete company.contacts;
						if (!attributes.links) delete company.links;
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