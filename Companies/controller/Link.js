/** Link
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de links externos
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Company = Model.Company;

    /** POST /company/:company_slug/product/:product_slug/link
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar link em produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,url,type}
     * @response : {confirmation}
     */
    app.post('/company/:company_slug/product/:product_slug/link', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.company_slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_slug, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_slug, path : 'product'}});
                                        } else {
                                            //coloca os dados do post em um objeto
                                            product.links.push({
                                                url : request.param('url', null),
                                                type : request.param('file', null)
                                            });
                                            //salva o link
                                            product.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({link : product.links.pop()});
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

    /** GET /company/:company_slug/product/:product_slug/links
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar links de produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[url,type]}
     */
    app.get('/company/:company_slug/product/:product_slug/links', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.company_slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_slug, path : 'company'}});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_slug, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_slug, path : 'product'}});
                            } else {
                                response.send({links : product.links});
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /company/:company_slug/product/:product_slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir link de produto
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {url,type}
     */
    app.get('/company/:company_slug/product/:product_slug/link/:id', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.company_slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_slug, path : 'company'}});
                } else {
                    //busca o produto
                    company.findProduct(request.params.product_slug, function (error, product) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o produto foi encontrado
                            if (product === null) {
                                response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_slug, path : 'product'}});
                            } else {
                                //busca o link
                                product.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrada
                                        if (link === null) {
                                            response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                                        } else {
                                            response.send({link : link});
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

    /** PUT /company/:company_slug/product/:product_slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar link de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,url,type}
     * @response : {confirmation}
     */
    app.put('/company/:company_slug/product/:product_slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.company_slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_slug, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_slug, path : 'product'}});
                                        } else {
                                            //busca o link
                                            product.findLink(request.params.id, function (error, link) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se o link foi encontrada
                                                    if (link === null) {
                                                        response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                                                    } else {
                                                        //altera os dados do link
                                                        link.type = request.param('type', link.type);
                                                        link.url = request.param('url', link.url);
                                                        //salva as modificações
                                                        link.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({link : link});
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

    /** DEL /company/:company_slug/product/:product_slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir link de produto
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:company_slug/product/:product_slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.company_slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.company_slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o produto
                                company.findProduct(request.params.product_slug, function (error, product) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o produto foi encontrado
                                        if (product === null) {
                                            response.send({error : {message :  'product not found', name : 'NotFoundError', id : request.params.product_slug, path : 'product'}});
                                        } else {
                                            //busca o link
                                            product.findLink(request.params.id, function (error, link) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se o link foi encontrada
                                                    if (link === null) {
                                                        response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                                                    } else {
                                                        //remove o link
                                                        link.remove(function (error) {
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

    /** POST /company/:slug/link
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar link em empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,url,type}
     * @response : {confirmation}
     */
    app.post('/company/:slug/link', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //coloca os dados do post em um objeto
                                company.links.push({
                                    url : request.param('url', null),
                                    type : request.param('type', null)
                                });
                                //salva a link
                                company.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({link : company.links.pop()});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** GET /company/:slug/links
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar links de empresa
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[url,type]}
     */
    app.get('/company/:slug/links', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.slug, path : 'company'}});
                } else {
                    response.send({links : company.links});
                }
            }
        });
    });

    /** GET /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir link de empresa
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {url,type}
     */
    app.get('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //busca a compania
        Company.findOne({slug : request.params.slug}, function (error, company) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se a compania foi encontrada
                if (company === null) {
                    response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.slug, path : 'company'}});
                } else {
                    //busca o link
                    company.findLink(request.params.id, function (error, link) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o link foi encontrada
                            if (link === null) {
                                response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                            } else {
                                response.send({link : link});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar link de empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token,url,type}
     * @response : {confirmation}
     */
    app.put('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o link
                                company.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrada
                                        if (link === null) {
                                            response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                                        } else {
                                            //altera os dados do link
                                            link.type = request.param('type', link.type);
                                            link.url = request.param('url', link.url);
                                            //salva as modificações
                                            company.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({link : link});
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

    /** DEL /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir link de empresa
     *
     * @allowedApp : Lista de Empresas
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca a compania
                Company.findOne({slug : request.params.slug}, function (error, company) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se a compania foi encontrada
                        if (company === null) {
                            response.send({error : {message :  'company not found', name : 'NotFoundError', id : request.params.slug, path : 'company'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! company.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o link
                                company.findLink(request.params.id, function (error, link) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se o link foi encontrada
                                    if (link === null) {
                                        response.send({error : {message :  'link not found', name : 'NotFoundError', id : request.params.id, path : 'link'}});
                                    } else {
                                        //remove o link
                                        link.remove();
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
            }
        });
    });
};