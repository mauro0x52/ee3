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

    /** POST /company/:company_id/product/:product_id/image
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
    app.post('/company/:company_id/product/:product_id/image', function (request, response) {
        response.contentType('json');

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
                                                // faz upload da imagem
                                                files.image.upload(
                                                    request.files.file,
                                                    '/companies/' + request.params.company_id + '/products/' + request.params.product_id + '/images',
                                                    function (error, data) {
                                                        if (error) {
                                                            response.send({error : error});
                                                        } else {
                                                            //coloca os dados do post em um objeto
                                                            product.images.push({
                                                                file : data._id,
                                                                url : data.url,
                                                                title : request.param('title', null),
                                                                legend : request.param('legend', null)
                                                            });
                                                            //salva a imagem
                                                            company.save(function (error) {
                                                                if (error) {
                                                                    response.send({error : error});
                                                                } else {
                                                                    response.send({image : product.images.pop()});
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

    /** GET /company/:company_id/product/:product_id/images
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
    app.get('/company/:company_id/product/:product_id/images', function (request, response) {
        response.contentType('json');

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
                                if (!product.images || !product.images.length) {
                                    response.send(null);
                                }
                                else {
                                    response.send({images : product.images});
                                }
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /company/:company_id/product/:product_id/image/:image_id
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
    app.get('/company/:company_id/product/:product_id/image/:image_id', function (request, response) {
        response.contentType('json');

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
                                //busca a imagem
                                product.findImage(request.params.image_id, function (error, image) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a imagem foi encontrada
                                        if (image === null) {
                                            response.send({error : {message :  'image not found', name : 'NotFoundError', id : request.params.image_id, model : 'image'}});
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

    /** PUT /company/:company_id/product/:product_id/image/:id
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
    app.put('/company/:company_id/product/:product_id/image/:image_id', function (request, response) {
        response.contentType('json');

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
                                            //busca a imagem
                                            product.findImage(request.params.image_id, function (error, image) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a imagem foi encontrada
                                                    if (image === null) {
                                                        response.send({error : {message :  'image not found', name : 'NotFoundError', id : request.params.image_id, model : 'image'}});
                                                    } else {
                                                        //altera os dados da imagem
                                                        image.title = request.param('title', image.title);
                                                        image.legend = request.param('legend', image.legend);
                                                        //salva as modificações
                                                        company.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({image : image});
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
            }
        });
    });

    /** DEL /company/:company_id/product/:product_id/image/:id
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
    app.del('/company/:company_id/product/:product_id/image/:image_id', function (request, response) {
        response.contentType('json');

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
                                            //busca a imagem
                                            product.findImage(request.params.image_id, function (error, image) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a imagem foi encontrada
                                                    if (image === null) {
                                                        response.send({error : {message :  'image not found', name : 'NotFoundError', id : request.params.image_id, model : 'image'}});
                                                    } else {
                                                        image.remove();
                                                        //remove a imagem
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
                                });
                            }
                        }
                    }
                });
            }
        });
    });
};
