/** Image
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de imagem
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        files  = require('./../Utils.js').files,
        Company = Model.Company;

    /** POST /company/:company_slug/product/:product_slug/image
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar imagem em produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,url,file,title,legend}
     * @response : {confirmation}
     */
    app.post('/company/:company_slug/product/:product_slug/image', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                                // faz upload da imagem
                                                files.image.upload(
                                                    request.files.file,
                                                    '/company/' + request.params.company_slug + '/product/' + request.params.product_slug + '/images',
                                                    function (error, data) {
                                                        if (error) {
                                                            response.send({error : error});
                                                        } else {
                                                            //coloca os dados do post em um objeto
                                                            product.images.push({
                                                                file : data.original._id,
                                                                url : data.url,
                                                                title : request.param('title', null),
                                                                legend : request.param('legend', null)
                                                            });
                                                            //salva a imagem
                                                            product.save(function (error) {
                                                                if (error) {
                                                                    response.send({error : error});
                                                                } else {
                                                                    response.send(product.images);
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

    /** GET /company/:company_slug/product/:product_slug/images
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar imagens de produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[file,url,title,legend]}
     */
    app.get('/company/:company_slug/product/:product_slug/images', function (request, response) {
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
                                response.send({images : product.images});
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /company/:company_slug/product/:product_slug/image/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir imagem
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {file,url,title,legend}
     */
    app.get('/company/:company_slug/product/:product_slug/image/:id', function (request, response) {
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
                                //busca a imagem
                                product.findImage(request.params.id, function (error, image) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a imagem foi encontrada
                                        if (image === null) {
                                            response.send({error : 'image not found'});
                                        } else {
                                            response.send({image : image});
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:company_slug/product/:product_slug/image/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar imagem
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,title,legend,url}
     * @response : {confirmation}
     */
    app.put('/company/:company_slug/product/:product_slug/image/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                            //busca a imagem
                                            product.findImage(request.params.id, function (error, image) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a imagem foi encontrada
                                                    if (image === null) {
                                                        response.send({error : 'image not found'});
                                                    } else {
                                                        //altera os dados da imagem
                                                        image.title = request.param('title', null);
                                                        image.legend = request.param('legend', null);
                                                        image.url = request.param('url', null);
                                                        //salva as modificações
                                                        image.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({error : ''});
                                                            }
                                                        });
                                                    }
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

    /** DEL /company/:company_slug/product/:product_slug/image/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir imagem
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:company_slug/product/:product_slug/image/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
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
                                            //busca a imagem
                                            product.findImage(request.params.id, function (error, image) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a imagem foi encontrada
                                                    if (image === null) {
                                                        response.send({error : 'image not found'});
                                                    } else {
                                                        //remove a imagem
                                                        image.remove(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({error : ''});
                                                            }
                                                        });
                                                    }
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