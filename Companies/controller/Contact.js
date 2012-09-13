/** Contact
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de contato
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:slug/contact
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar contato
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,address,type}
     * @response : {confirmation}
     */
    app.post('/company/:slug/contact', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
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
                                //coloca os dados do post em um objeto
                                company.contacts.push({
                                    address : request.param('address', null),
                                    type    : request.param('type', null)
                                });
                                //salva o contato
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(company.contacts.pop());
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** GET /company/:company_slug/contact
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar contato
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{address,type}]}
     */
    app.get('/company/:slug/contacts', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    response.send(company.contacts);
                }
            }
        });
    });

    /** GET /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir contato
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {address,type}
     */
    app.get('/company/:slug/contact/:id', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    //busca o contato
                    company.findContact(request.params.id, function (error, contact) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o contato foi encontrado
                            if (contact === null) {
                                response.send({error : 'contact not found'});
                            } else {
                                response.send(contact);
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar contato
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,address,type}
     * @response : {confirmation}
     */
    app.put('/company/:slug/contact/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
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
                                //busca o contato
                                company.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : 'contact not found'});
                                        } else {
                                            //altera os dados do contato
                                            contact.address = request.param('address', contact.address);
                                            contact.type = request.param('type', contact.type);
                                            //salva as alterações
                                            company.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(contact);
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** DEL /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir contato
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/contact/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
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
                                //busca o contato
                                company.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : 'contact not found'});
                                        } else {
                                            //remove o contato
                                            contact.remove();
                                            company.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(null);
                                                }
                                            });
                                        }
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