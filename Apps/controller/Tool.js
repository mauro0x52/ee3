/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de ferramentas
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        App  = Model.App,
        Tool  = Model.Tool;

    /** POST /app/:slug/tool
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar ferramenta
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {name,code}
     * @response : {confirmation}
     */
    app.post('/app/:slug/version/:number/tool', function (request, response) {
        var tool;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : 'app not found'});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (request.param('login', null) !== app.creator) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : 'version not found'});
                                        } else {
                                            //pega os dados do post e coloca em um objeto
                                            tool = new Tool({
                                                name      : request.param('name', null),
                                                source    : request.param('source', null),
                                                versionId : version._id
                                            });
                                            //salva a nova ferramenta
                                            tool.save(function (error) {
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
                    }
                });
            } else {
                response.send({error : 'invalid user or token'});
            }
        });
    });

    /** GET /app/:slug/version/:number/tools
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar ferramentas
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{number}]}
     */
    app.get('/app/:slug/version/:number/tools', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca o app
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : 'app not found'});
                } else {
                    //pega versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : 'version not foud'});
                            } else {
                                //pega ferramentas
                                version.tools(function (error, tools) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({tools : tools});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /app/:slug/version/:number/tool/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir ferramenta
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {number}
     */
    app.get('/app/:slug/version/:number/tool/:name', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca o app
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : 'app not found'});
                } else {
                    //pega a versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : 'version not found'});
                            } else {
                                version.findTool(request.params.name, function (error, tool) {
                                    if (error) {
                                        console.log({error : error});
                                    } else {
                                        //verifica se a ferramente foi encontrada
                                        if (tool === null) {
                                            response.send({error : 'tool not found'});
                                        } else {
                                            response.send({tool : tool});
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

    /** DEL /app/:slug/version/:number/tool/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir ferramenta
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/app/:slug/version/:number/tool/:name', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : 'app not found'});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (request.param('login', null) !== app.creator) {
                                response.send({error : 'permission denied'});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : 'version not found'});
                                        } else {
                                            //pega a ferramenta
                                            version.findTool(request.params.name, function (error, tool) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a ferramenta foi encontrada
                                                    if (tool === null) {
                                                        response.send({error : 'tool not found'});
                                                    } else {
                                                        //remove a ferramenta
                                                        tool.remove(function (error) {
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
                response.send({error : 'invalid user or token'});
            }
        });
    });

    /** PUT /app/:slug/version/:number/tool/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar ferramenta
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {number}
     * @response : {confirmation}
     */
    app.put('/app/:slug/version/:number/tool/:oldname', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : 'app not found'});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (request.param('login', null) !== app.creator) {
                                response.send({error : 'permission denied'});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : 'version not found'});
                                        } else {
                                            //busca a ferramenta
                                            version.findTool(request.params.oldname, function (error, tool) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a ferramenta foi encontrada
                                                    if (tool === null) {
                                                        response.send({error : 'tool not found'});
                                                    } else {
                                                        //altera os dados da ferramenta
                                                        if (request.param('name', null) || request.param('source', null) !== "") {
                                                            tool.name = request.param('name', null)
                                                        }
                                                        if (request.param('source', null)) {
                                                            tool.source = request.param('source', null);
                                                        }
                                                        //salva modificações
                                                        tool.save(function (error) {
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
                response.send({error : 'invalid user or token'});
            }
        });
    });
};