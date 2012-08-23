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
                            if (! company.isOwner(user._id)) {
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
                                                    response.send(product);
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
                                response.send(product.links);
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
                                //busca o link
                                product.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrada
                                        if (link === null) {
                                            response.send({error : 'link not found'});
                                        } else {
                                            response.send(link);
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
                            if (! company.isOwner(user._id)) {
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
                                            //busca o link
                                            product.findLink(request.params.id, function (error, link) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se o link foi encontrada
                                                    if (link === null) {
                                                        response.send({error : 'link not found'});
                                                    } else {
                                                        //altera os dados do link
                                                        link.type = request.param('type', null);
                                                        link.url = request.param('url', null);
                                                        //salva as modificações
                                                        link.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send(link);
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
                            if (! company.isOwner(user._id)) {
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
                                            //busca o link
                                            product.findLink(request.params.id, function (error, link) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se o link foi encontrada
                                                    if (link === null) {
                                                        response.send({error : 'link not found'});
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
            } else {
                response.send({error : 'invalid token'});
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
                                company.links.push({
                                    url : request.param('url', null),
                                    type : request.param('type', null)
                                });
                                //salva a link
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
                    response.send({error : 'company not found'});
                } else {
                    response.send(company.links);
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
                    response.send({error : 'company not found'});
                } else {
                    //busca o link
                    company.findLink(request.params.id, function (error, link) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se o link foi encontrada
                            if (link === null) {
                                response.send({error : 'link not found'});
                            } else {
                                response.send(link);
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
                                //busca o link
                                company.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrada
                                        if (link === null) {
                                            response.send({error : 'link not found'});
                                        } else {
                                            //altera os dados do link
                                            link.type = request.param('type', null);
                                            link.url = request.param('url', null);
                                            //salva as modificações
                                            link.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(link);
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
                                //busca o link
                                company.findLink(request.params.id, function (error, link) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se o link foi encontrada
                                    if (link === null) {
                                        response.send({error : 'link not found'});
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
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
};