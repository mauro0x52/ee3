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

    /** POST /company/:company_id/product/:product_id/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Cadastrar thumbnail em produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {token,file}
     * @response : {confirmation}
     */
    app.post('/company/:company_id/product/:product_id/thumbnail', function postProductThumbnail(request, response) {
        var thumbnail;

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : 'company not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_id, function (error, product) {
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
                                                    '/companies/' + company.slug + '/products/' + product.slug + '/thumbnails',
                                                    function (error, data) {
                                                        if (error) {
                                                            response.send({error : error});
                                                        } else {
                                                            product.thumbnail = {
                                                                original : {
                                                                    file : data.original._id,
                                                                    url : data.original.url,
                                                                    title : 'thumbnail',
                                                                    legend : 'original'
                                                                },
                                                                small : {
                                                                    file : data.small._id,
                                                                    url : data.small.url,
                                                                    title : 'thumbnail',
                                                                    legend : '50x50 thumbnail'
                                                                },
                                                                medium : {
                                                                    file : data.medium._id,
                                                                    url : data.medium.url,
                                                                    title : 'thumbnail',
                                                                    legend : '100x100 thumbnail'
                                                                },
                                                                large : {
                                                                    file : data.large._id,
                                                                    url : data.large.url,
                                                                    title : 'thumbnail',
                                                                    legend : '200x200 thumbnail'
                                                                }
                                                            };
                                                            product.save(function (error) {
                                                                if (error) {
                                                                    response.send({error: error});
                                                                }
                                                                else {
                                                                    response.send(product.thumbnail);
                                                                }
                                                            });
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

    /** GET /company/:company_id/product/:product_id/thumbnails
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
    app.get('/company/:company_id/product/:product_id/thumbnail', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_id, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : 'product not found'});
                            } else {
                                // se o thumbnail nao esta setado
                                if (!product.thumbnail || !product.thumbnail.original || !product.thumbnail.original.url) {
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

    /** GET /company/:company_id/product/:product_id/thumbnail/:type
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
    app.get('/company/:company_id/product/:product_id/thumbnail/:size', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_id, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : 'product not found'});
                            } else {
                                // se nao tem nenhuma imagem
                                if (!product.thumbnail || !product.thumbnail.original || !product.thumbnail.original.url) {
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

    /** PUT /company/:company_id/product/:product_id/thumbnail
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar thumbnail de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {token,title,legend}
     * @response : {confirmation}
     */
    app.put('/company/:company_id/product/:product_id/thumbnail', function (request, response) {
        postProductThumbnail(request, response);
    });

    /** DEL /company/:company_id/product/:product_id/thumbnail
     *
     * @author : Rafael Erthal, Mauro Ribeiro
     * @since : 2012-08
     *
     * @description : Excluir thumbnail de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/company/:company_id/product/:product_id/thumbnail', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
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
                                //busca o produto
                                company.findProduct(request.params.product_id, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : 'product not found'});
                                        } else {
                                            product.thumbnail = undefined;
                                            product.save(function (error) {
                                                if (error) {
                                                    response.send({error: error});
                                                }
                                                else {
                                                    response.send(undefined);
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
     * @request : {token,file}
     * @response : {confirmation}
     */
    app.post('/company/:company_id/thumbnail', function postCompanyThumbnail (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca a compania
                Company.findByIdentity(request.param('company_id'), function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : 'company not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                // verifica se foi enviado algum arquivo
                                if (!request.files || !request.files.file) {
                                    response.send({error : 'no selected file'});
                                } else {
                                    // faz upload dos thumbnails
                                    files.image.thumbnail.upload(
                                        request.files.file,
                                        '/companies/' + request.params.slug + '/thumbnails',
                                        function(error, data) {
                                            if (error) {
                                                response.send({ error : error });
                                            } else {
                                                company.thumbnail = {
                                                    original : {
                                                        file : data.original._id,
                                                        url : data.original.url,
                                                        title : 'thumbnail',
                                                        legend : 'original'
                                                    },
                                                    small : {
                                                        file : data.small._id,
                                                        url : data.small.url,
                                                        title : 'thumbnail',
                                                        legend : '50x50 thumbnail'
                                                    },
                                                    medium : {
                                                        file : data.medium._id,
                                                        url : data.medium.url,
                                                        title : 'thumbnail',
                                                        legend : '100x100 thumbnail'
                                                    },
                                                    large : {
                                                        file : data.large._id,
                                                        url : data.large.url,
                                                        title : 'thumbnail',
                                                        legend : '200x200 thumbnail'
                                                    }
                                                };
                                                company.save(function (error) {
                                                    if (error) {
                                                        response.send({error: error});
                                                    }
                                                    else {
                                                        response.send(company.thumbnail);
                                                    }
                                                });
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
    app.get('/company/:company_id/thumbnail', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail || !company.thumbnail.original || !company.thumbnail.original.url) {
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
    app.get('/company/:company_id/thumbnail/:size', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : 'company not found'});
                } else {
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail || !company.thumbnail.original || !company.thumbnail.original.url) {
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
     * @request : {token, file}
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
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/company/:company_id/thumbnail', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : 'company not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                company.thumbnail = undefined;
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    }
                                    else {
                                        response.send(undefined);
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