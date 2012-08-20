/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de plugins
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        App  = Model.App,
        Plugin  = Model.Plugin;

    /** POST /app/:slug/plugin
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar plugin
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {token, name,code}
     * @response : {confirmation}
     */
    app.post('/app/:slug/version/:number/plugin', function (request, response) {
        var plugin;

        response.contentType('json');

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
                            if (user._id !== app.creator) {
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
                                            plugin = new Plugin({
                                                name      : request.param('name', null),
                                                source    : request.param('source', null),
                                                versionId : version._id
                                            });
                                            //salva a nova plugin
                                            plugin.save(function (error) {
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

    /** GET /app/:slug/version/:number/plugins
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar plugins
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{number}]}
     */
    app.get('/app/:slug/version/:number/plugins', function (request, response) {
        response.contentType('json');

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
                                //pega plugins
                                version.plugins(function (error, plugins) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({plugins : plugins});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /app/:slug/version/:number/plugin/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir plugin
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {number}
     */
    app.get('/app/:slug/version/:number/plugin/:name', function (request, response) {
        response.contentType('json');

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
                                version.findPlugin(request.params.name, function (error, plugin) {
                                    if (error) {
                                        console.log({error : error});
                                    } else {
                                        //verifica se a ferramente foi encontrada
                                        if (plugin === null) {
                                            response.send({error : 'plugin not found'});
                                        } else {
                                            response.send({plugin : plugin});
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

    /** DEL /app/:slug/version/:number/plugin/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir plugin
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/app/:slug/version/:number/plugin/:name', function (request, response) {
        response.contentType('json');

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
                            if (user._id !== app.creator) {
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
                                            //pega a plugin
                                            version.findPlugin(request.params.name, function (error, plugin) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a plugin foi encontrada
                                                    if (plugin === null) {
                                                        response.send({error : 'plugin not found'});
                                                    } else {
                                                        //remove a plugin
                                                        plugin.remove(function (error) {
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

    /** PUT /app/:slug/version/:number/plugin/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar plugin
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token, number, name, source}
     * @response : {confirmation}
     */
    app.put('/app/:slug/version/:number/plugin/:oldname', function (request, response) {
        response.contentType('json');

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
                            if (user._id !== app.creator) {
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
                                            //busca a plugin
                                            version.findPlugin(request.params.oldname, function (error, plugin) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a plugin foi encontrada
                                                    if (plugin === null) {
                                                        response.send({error : 'plugin not found'});
                                                    } else {
                                                        //altera os dados da plugin
                                                        if (request.param('name', null) || request.param('name', null) !== "") {
                                                            plugin.name = request.param('name', null);
                                                        }
                                                        if (request.param('source', null)) {
                                                            plugin.source = request.param('source', null);
                                                        }
                                                        //salva modificações
                                                        plugin.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({Plugin : plugin});
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