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
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca a compania
                Company.find({slug : request.params.slug}, function (error, company) {
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
                                //TODO implementar funcionalidades
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
        Company.find({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    //TODO implementar funcionalidades
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
        Company.find({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    //TODO implementar funcionalidades
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
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca a compania
                Company.find({slug : request.params.slug}, function (error, company) {
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
                                //TODO implementar funcionalidades
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
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca a compania
                Company.find({slug : request.params.slug}, function (error, company) {
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
                                //TODO implementar funcionalidades
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