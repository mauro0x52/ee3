/** Thumbnail
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de thumbnail
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        files  = require('./../Utils.js').files,
        Company = Model.Company,
        config = require('./../config.js');

    /** POST /company/:company_slug/product/:product_slug/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Cadastrar thumbnail em produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,file,title,legend}
     * @response : {confirmation}
     */
    app.post('/company/:company_slug/product/:product_slug/thumbnail', function postProductThumbnail (request, response) {
        var thumbnail;

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
                            if (!company.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_slug, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : 'product not found'});
                                        } else {
                                            // verifica se foi enviado algum arquivo
                                            if (!request.files || !request.files.file) {
                                                response.send({error : 'no selected file'});
                                            } else {
                                                // faz upload dos thumbnails
                                                files.image.thumbnail.upload(
                                                    request.files.file,
                                                    '/company/' + request.params.company_slug + '/product/' + request.params.product_slug + '/thumbnail',
                                                    function (error, data) {
                                                        if (error) {
                                                            response.send({error : error});
                                                        } else {
                                                            product.thumbnail.small.file = data.small._id;
                                                            product.thumbnail.small.url = data.small.url;
                                                            product.thumbnail.small.title = 'thumbnail';
                                                            product.thumbnail.small.legend = '50x50 thumbnail';
                                                            product.thumbnail.medium.file = data.medium._id;
                                                            product.thumbnail.medium.url = data.medium.url;
                                                            product.thumbnail.medium.title = 'thumbnail';
                                                            product.thumbnail.medium.legend = '100x100 thumbnail';
                                                            product.thumbnail.large.file = data.small._id;
                                                            product.thumbnail.large.url = data.small.url;
                                                            product.thumbnail.large.title = 'thumbnail';
                                                            product.thumbnail.large.legend = '200x200 thumbnail';
                                                            product.thumbnail.original.file = data.original._id;
                                                            product.thumbnail.original.url = data.original.url;
                                                            product.thumbnail.original.title = 'original';
                                                            product.thumbnail.original.legend = 'original';
                                                            product.save();
                                                            response.send(product.thumbnail);
                                                        }
                                                    }
                                                );
                                            }
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

    /** GET /company/:company_slug/product/:product_slug/thumbnails
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Listar thumbnails de produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[file,url,title,legend]}
     */
    app.get('/company/:company_slug/product/:product_slug/thumbnail', function (request, response) {
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
                    //busca o produto
                    company.findProduct(request.params.product_slug, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : 'product not found'});
                            } else {
                                // se o thumbnail nao esta setado
                                if (!product.thumbnail.original.url) {
                                    response.send(undefined);
                                } else {
                                    response.send(product.thumbnail);
                                }
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /company/:company_slug/product/:product_slug/thumbnail/:type
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Exibir thumbnail de produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {file,url,title,legend}
     */
    app.get('/company/:company_slug/product/:product_slug/thumbnail/:size', function (request, response) {
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
                    //busca o produto
                    company.findProduct(request.params.product_slug, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : 'product not found'});
                            } else {
                                // se nao tem nenhuma imagem
                                if (!product.thumbnail.original.url) {
                                    response.send(undefined);
                                } else {
                                    if (size === 'original') {
                                        response.send(product.thumbnail.original);
                                    } else if (size === 'large') {
                                        response.send(product.thumbnail.large);
                                    } else if (size === 'medium')  {
                                        response.send(product.thumbnail.medium);
                                    } else {
                                        response.send(product.thumbnail.small);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:company_slug/product/:product_slug/thumbnail
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar thumbnail de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,title,legend}
     * @response : {confirmation}
     */
    app.put('/company/:company_slug/product/:product_slug/thumbnail', function (request, response) {
        postProductThumbnail(request, response);
    });

    /** DEL /company/:company_slug/product/:product_slug/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Excluir thumbnail de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:company_slug/product/:product_slug/thumbnail', function (request, response) {
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
                                //busca o produto
                                company.findProduct(request.params.product_slug, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : 'product not found'});
                                        } else {
                                            product.thumbnail.small.file = undefined;
                                            product.thumbnail.small.url = undefined;
                                            product.thumbnail.small.title = undefined;
                                            product.thumbnail.small.legend = undefined;
                                            product.thumbnail.medium.file = undefined;
                                            product.thumbnail.medium.url = undefined;
                                            product.thumbnail.medium.title = undefined;
                                            product.thumbnail.medium.legend = undefined;
                                            product.thumbnail.large.file = undefined;
                                            product.thumbnail.large.url = undefined;
                                            product.thumbnail.large.title = undefined;
                                            product.thumbnail.large.legend = undefined;
                                            product.thumbnail.original.file = undefined;
                                            product.thumbnail.original.url = undefined;
                                            product.thumbnail.original.title = undefined;
                                            product.thumbnail.original.legend = undefined;
                                            product.save();
                                            response.send(undefined);
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

    /** POST /company/:slug/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Cadastrar thumbnail em empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,file,title,legend}
     * @response : {confirmation}
     */
    app.post('/company/:slug/thumbnail', function postCompanyThumbnail (request, response) {
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
                                // verifica se foi enviado algum arquivo
                                if (!request.files || !request.files.file) {
                                    response.send({error : 'no selected file'});
                                } else {
                                    // faz upload dos thumbnails
                                    files.image.thumbnail.upload(
                                        request.files.file, 
                                        '/company/' + request.params.company_slug + '/thumbnail', 
                                        function(error, data) {
                                            if (error) {
                                                response.send({ error : error });
                                            } else {
                                                company.thumbnail.small.file = data.small._id;
                                                company.thumbnail.small.url = data.small.url;
                                                company.thumbnail.small.title = 'thumbnail';
                                                company.thumbnail.small.legend = '50x50 thumbnail';
                                                company.thumbnail.medium.file = data.medium._id;
                                                company.thumbnail.medium.url = data.medium.url;
                                                company.thumbnail.medium.title = 'thumbnail';
                                                company.thumbnail.medium.legend = '100x100 thumbnail';
                                                company.thumbnail.large.file = data.small._id;
                                                company.thumbnail.large.url = data.small.url;
                                                company.thumbnail.large.title = 'thumbnail';
                                                company.thumbnail.large.legend = '200x200 thumbnail';
                                                company.thumbnail.original.file = data.original._id;
                                                company.thumbnail.original.url = data.original.url;
                                                company.thumbnail.original.title = 'thumbnail';
                                                company.thumbnail.original.legend = 'original';
                                                company.save();
                                                response.send(company.thumbnail);
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });

    /** GET /company/:slug/thumbnail
     *
     * @author : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar imagens de empresa
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[file,url,title,legend]}
     */
    app.get('/company/:slug/thumbnail', function (request, response) {
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
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail.original.url) {
                        response.send(undefined);
                    } else {
                        response.send(company.thumbnail);
                    }
                }
            }
        });
    });

    /** GET /company/:slug/thumbnail/:size
     *
     * @author : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir thumbnail de empresa
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {file,url,title,legend}
     */
    app.get('/company/:slug/thumbnail/:size', function (request, response) {
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
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail.original.url) {
                        response.send(undefined);
                    } else {
                        if (size === 'original') {
                            response.send(product.thumbnail.original);
                        } else if (size === 'large') {
                            response.send(product.thumbnail.large);
                        } else if (size === 'medium')  {
                            response.send(product.thumbnail.medium);
                        } else {
                            response.send(product.thumbnail.small);
                        }
                    }
                }
            }
        });
    });

    /** PUT /company/:slug/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Editar thumbnail de empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,title,legend}
     * @response : {confirmation}
     */
    app.put('/company/:slug/thumbnail/:type', function (request, response) {
        postCompanyThumbnail(request, response);
    });

    /** DEL /company/:slug/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Excluir thumbnail de empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/thumbnail', function (request, response) {
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
                                company.thumbnail.small.file = undefined;
                                company.thumbnail.small.url = undefined;
                                company.thumbnail.small.title = undefined;
                                company.thumbnail.small.legend = undefined;
                                company.thumbnail.medium.file = undefined;
                                company.thumbnail.medium.url = undefined;
                                company.thumbnail.medium.title = undefined;
                                company.thumbnail.medium.legend = undefined;
                                company.thumbnail.large.file = undefined;
                                company.thumbnail.large.url = undefined;
                                company.thumbnail.large.title = undefined;
                                company.thumbnail.large.legend = undefined;
                                company.thumbnail.original.file = undefined;
                                company.thumbnail.original.url = undefined;
                                company.thumbnail.original.title = undefined;
                                company.thumbnail.original.legend = undefined;
                                company.save();
                                response.send(undefined);
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