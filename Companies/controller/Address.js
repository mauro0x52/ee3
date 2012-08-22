/** Address
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de endereço
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:slug/address
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar endereço
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,street,number,complement,city,headQuarters}
     * @response : {confirmation}
     */
    app.post('/company/:slug/address', function (request, response) {
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
                                company.addresses.push({
                                    street : request.param('street', null),
                                    number : request.param('number', null),
                                    complement : request.param('complement', null),
                                    city : request.param('city', null),
                                    headQuarters : request.param('headQuarters', null)
                                });
                                //salva o endereço
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
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });

    /** GET /company/:company_slug/addresses
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar endereços
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,street,number,complement,city,headQuarters}]}
     */
    app.get('/company/:slug/addresses', function (request, response) {
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
                    response.send(company.addresses);
                }
            }
        });
    });

    /** GET /company/:slug/address/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir endereço
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,number,street,number,complement,city,headQuarters}
     */
    app.get('/company/:slug/address/:id', function (request, response) {
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
                    //busca o endereço
                    company.findAddress(request.params.id, function (error, address) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o endereço foi encontrado
                            if (address === null) {
                                response.send({error : 'address not found'});
                            } else {
                                response.send(address);
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/address/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar endereço
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,street,number,complement,city,headQuarters}
     * @response : {confirmation}
     */
    app.put('/company/:slug/address/:id', function (request, response) {
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
                                //busca o endereço
                                company.findAddress(request.params.id, function (error, address) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o endereço foi encontrado
                                        if (address === null) {
                                            response.send({error : 'address not found'});
                                        } else {
                                            //altera os dados do endereço
                                            address.street = request.param('street', null);
                                            address.number = request.param('number', null);
                                            address.complement = request.param('complement', null);
                                            address.city = request.param('city', null);
                                            address.headQuarters = request.param('headQuarters', null);
                                            //salva as alterações
                                            address.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(address);
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

    /** DEL /company/:slug/address/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir endereço
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/address/:id', function (request, response) {
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
                                //busca o endereço
                                company.findAddress(request.params.id, function (error, address) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o endereço foi encontrado
                                        if (address === null) {
                                            response.send({error : 'address not found'});
                                        } else {
                                            //remove o endereço
                                            address.remove(function (error) {
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