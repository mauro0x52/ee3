/** Embedded
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de embedded
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:slug/embedded
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar embedded
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,link,embed}
     * @response : {confirmation}
     */
    app.post('/company/:slug/embedded', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                response.send({error : 'permission denied'});
                            } else {
                                //coloca os dados do post em um objeto
                                company.embeddeds.push({
                                    link  : request.param('link', null),
                                    embed : request.param('embed', null)
                                });
                                //salva o embedded
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(company.embeddeds.pop());
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

    /** GET /company/:company_slug/embeddeds
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar embedded
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,street,link,embed}]}
     */
    app.get('/company/:slug/embeddeds', function (request, response) {
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
                    response.send(company.embeddeds);
                }
            }
        });
    });

    /** GET /company/:slug/embedded/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir embedded
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,number,link,embed}
     */
    app.get('/company/:slug/embedded/:id', function (request, response) {
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
                    //busca o embbeded
                    company.findEmbedded(request.params.id, function (error, embedded) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o embedded foi encontrado
                            if (embedded === null) {
                                response.send({error : 'embedded not found'});
                            } else {
                                response.send(embedded);
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/embedded/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar embedded
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,link,embed}
     * @response : {confirmation}
     */
    app.put('/company/:slug/embedded/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o embedded
                                company.findEmbedded(request.params.id, function (error, embedded) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o embedded foi encontrado
                                        if (embedded === null) {
                                            response.send({error : 'embedded not found'});
                                        } else {
                                            //altera os dados do embbeded
                                            embedded.link = request.param('link', null);
                                            embedded.embed = request.param('embed', null);
                                            //salva as alterações
                                            embedded.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(embedded);
                                                }
                                            });
                                        }
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

    /** DEL /company/:slug/embedded/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir embedded
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/embedded/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o embedded
                                company.findEmbedded(request.params.id, function (error, embedded) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o embedded foi encontrado
                                        if (embedded === null) {
                                            response.send({error : 'embedded not found'});
                                        } else {
                                            //remove o embedded
                                            embedded.remove();
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
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
};