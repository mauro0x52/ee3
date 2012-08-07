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
        var product = [];

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
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
                            if (! company.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //Adiciona os campos no objeto products
                                company.products.push({
                                    name       : request.param('name', null),
                                    slugs      : request.param('slugs', null),
                                    abstract   : request.param('abstract', null),
                                    about      : request.param('about', null)
                                });
                                //salva a Company
                                company.save (function(error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({error : ""});
                                    }
                                })
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
        Company.findOne({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    response.send({Products : company.products});
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
        Company.findOne({slug : request.params.company_slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    company.findProduct (request.params.product_slug,function (error, product){
                        response.send({Product : product});
                    });
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
                Company.findOne({slug : request.params.company_slug}, function (error, company) {
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
                                company.findProduct(request.params.product_slug, function(error, product){
                                    product.name = request.param('name');
                                    product.slugs = request.param('slugs');
                                    product.abstract = request.param('abstract');
                                    product.about = request.param('about');
                                    
                                    product.save(function(error){
                                        if (error) {
                                            response.send({error : error});
                                        } else {
                                            response.send({Product : product});
                                        }
                                    });
                                })
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
                Company.findOne({slug : request.params.company_slug}, function (error, company) {
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
                                company.findProduct (request.params.product_slug, function(error, product){
                                    if (error) {
                                        request.send({error : error});
                                    } else {
                                        product.remove(function(error){
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({error:''});
                                            }
                                        })
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