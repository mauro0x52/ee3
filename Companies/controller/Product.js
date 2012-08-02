/** Product
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de produto
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:slug/product
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token, name, slug, abstract, about}
     * @response : {confirmation}
     */
    app.post('/company/:slug/product', function (request, response) {
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

    /** GET /company/:company_slug/products
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar produtos
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{name,slug,abstract,about}]}
     */
    app.get('/company/:slug/products', function (request, response) {
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

    /** GET /company/:company_slug/product/:product_slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {name,slug,abstract,about}
     */
    app.get('/company/:company_slug/product/:product_slug', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.find({slug : request.params.company_slug}, function (error, company) {
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

    /** PUT /company/:company_slug/product/:product_slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,name,slug,abstract,about}
     * @response : {confirmation}
     */
    app.put('/company/:company_slug/product/:product_slug', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca a compania
                Company.find({slug : request.params.company_slug}, function (error, company) {
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

    /** DEL /company/:company_slug/product/:product_slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:company_slug/product/:product_slug', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca a compania
                Company.find({slug : request.params.company_slug}, function (error, company) {
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