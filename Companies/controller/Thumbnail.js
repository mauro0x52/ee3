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
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_id, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_id, model : 'product'}});
                                        } else {
                                            // verifica se foi enviado algum arquivo
                                            if (!request.files || !request.files.file) {
                                                response.send({error : {message : 'no selected file', name : 'ValidationError', errors : {file : {message : 'no selected file', name : 'ValidatorError', path : 'file', type : 'required'}}}});
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
                                                            company.save(function (error) {
                                                                if (error) {
                                                                    response.send({error: error});
                                                                }
                                                                else {
                                                                    response.send({thumbnail : product.thumbnail});
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_id, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_id, model : 'product'}});
                            } else {
                                // se o thumbnail nao esta setado
                                if (!product.thumbnail || !product.thumbnail.original || !product.thumbnail.original.url) {
                                    response.send(null);
                                } else {
                                    response.send({thumbnail : product.thumbnail});
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_id, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_id, model : 'product'}});
                            } else {
                                // se nao tem nenhuma imagem
                                if (!product.thumbnail || !product.thumbnail.original || !product.thumbnail.original.url) {
                                    response.send(null);
                                } else {
                                    if (request.params.size === 'original') {
                                        response.send({original : product.thumbnail.original});
                                    } else if (request.params.size === 'large') {
                                        response.send({large : product.thumbnail.large});
                                    } else if (request.params.size === 'medium')  {
                                        response.send({medium : product.thumbnail.medium});
                                    } else {
                                        response.send({small : product.thumbnail.small});
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
        response.header('Access-Control-Allow-Origin', '*');
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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_id, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_id, model : 'product'}});
                                        } else {
                                            product.thumbnail = null;
                                            company.save(function (error) {
                                                if (error) {
                                                    response.send({error: error});
                                                }
                                                else {
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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.param('company_id'), function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                // verifica se foi enviado algum arquivo
                                if (!request.files || !request.files.file) {
                                    response.send({error : {message : 'no selected file', name : 'ValidationError', errors : {file : {message : 'no selected file', name : 'ValidatorError', path : 'file', type : 'required'}}}});
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
                                                        response.send({thumbnail : company.thumbnail});
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                } else {
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail || !company.thumbnail.original || !company.thumbnail.original.url) {
                        response.send(null);
                    } else {
                        response.send({thumbnail : company.thumbnail});
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca a compania
        Company.findByIdentity(request.params.company_id, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                } else {
                    // se o thumbnail nao esta setado
                    if (!company.thumbnail || !company.thumbnail.original || !company.thumbnail.original.url) {
                        response.send(null);
                    } else {
                        if (request.params.size === 'original') {
                            response.send({original : company.thumbnail.original});
                        } else if (request.params.size === 'large') {
                            response.send({large : company.thumbnail.large});
                        } else if (request.params.size === 'medium')  {
                            response.send({medium : company.thumbnail.medium});
                        } else {
                            response.send({small : company.thumbnail.small});
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
        response.header('Access-Control-Allow-Origin', '*');
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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findByIdentity(request.params.company_id, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_id, model : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (!company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                company.thumbnail = null;
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    }
                                    else {
                                        response.send(null);
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
