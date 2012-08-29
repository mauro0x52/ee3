/** Phone
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de telefone
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:slug/phone
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar telefone
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,type,number,extension,areaCode,intCode}
     * @response : {confirmation}
     */
    app.post('/company/:slug/phone', function (request, response) {
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
                                company.phones.push({
                                    type : request.param('type', null),
                                    number : request.param('number', null),
                                    extension : request.param('extension', null),
                                    areaCode : request.param('areaCode', null),
                                    intCode : request.param('intCode', null)
                                });
                                //salva o telefone
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(company.phones.pop());
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

    /** GET /company/:company_slug/phones
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar telefones
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,number,extension,areaCode,intCode}]}
     */
    app.get('/company/:slug/phones', function (request, response) {
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
                    response.send(company.phones);
                }
            }
        });
    });

    /** GET /company/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir telefone
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,number,extension,areaCode,intCode}
     */
    app.get('/company/:slug/phone/:id', function (request, response) {
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
                    //busca o telefone
                    company.findPhone(request.params.id, function (error, phone) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o telefone foi encontrado
                            if (phone === null) {
                                response.send({error : 'phone not found'});
                            } else {
                                response.send(phone);
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar telefone
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,type,number,extension,areaCode,intCode}
     * @response : {confirmation}
     */
    app.put('/company/:slug/phone/:id', function (request, response) {
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
                                //busca o telefone
                                company.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o telefone foi encontrado
                                        if (phone === null) {
                                            response.send({error : 'phone not found'});
                                        } else {
                                            //altera os dados do telefone
                                            phone.type = request.param('type', phone.type);
                                            phone.number = request.param('number', phone.number);
                                            phone.extension = request.param('extension', phone.extension);
                                            phone.areaCode = request.param('areaCode', phone.areaCode);
                                            phone.intCode = request.param('intCode', phone.intCode);
                                            //salva as alterações
                                            company.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(phone);
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

    /** DEL /company/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir telefone
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/phone/:id', function (request, response) {
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
                                //busca o telefone
                                company.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o telefone foi encontrado
                                        if (phone === null) {
                                            response.send({error : 'phone not found'});
                                        } else {
                                            //remove o telefone
                                            phone.remove();
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