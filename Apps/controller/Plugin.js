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
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, model : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : {message : 'permission denied', name : 'PermissionDenied'}});
                            } else {
                                //busca a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, model : 'version'}});
                                        } else {
                                            //pega os dados do post e coloca em um objeto
                                            plugin = new Plugin({
                                                name      : request.param('name', null),
                                                source    : request.param('source', null),
                                                slug      : request.param('slug', null),
                                                version   : version._id
                                            });
                                            //salva a nova plugin
                                            plugin.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send(plugin);
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
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, model : 'app'}});
                } else {
                    //pega versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, model : 'version'}});
                            } else {
                                //pega plugins
                                version.plugins(function (error, plugins) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(plugins);
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
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, model : 'app'}});
                } else {
                    //pega a versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, model : 'version'}});
                            } else {
                                version.findPlugin(request.params.name, function (error, plugin) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a ferramente foi encontrada
                                        if (plugin === null) {
                                            response.send({error : { message : 'plugin not found', name : 'NotFoundError', id : request.params.name, model : 'plugin'}});
                                        } else {
                                            response.send(plugin);
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
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, model : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : {message : 'permission denied', name : 'PermissionDenied'}});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, model : 'version'}});
                                        } else {
                                            //pega a plugin
                                            version.findPlugin(request.params.name, function (error, plugin) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a plugin foi encontrada
                                                    if (plugin === null) {
                                                        response.send({error : { message : 'plugin not found', name : 'NotFoundError', id : request.params.name, model : 'plugin'}});
                                                    } else {
                                                        //remove a plugin
                                                        plugin.remove(function (error) {
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
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o app
                App.findOne({slug : request.params.slug}, function (error, app) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o app foi encontrado
                        if (app === null) {
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, model : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : {message : 'permission denied', name : 'PermissionDenied'}});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, model : 'version'}});
                                        } else {
                                            //busca a plugin
                                            version.findPlugin(request.params.oldname, function (error, plugin) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a plugin foi encontrada
                                                    if (plugin === null) {
                                                        response.send({error : { message : 'plugin not found', name : 'NotFoundError', id : request.params.name, model : 'plugin'}});
                                                    } else {
                                                        //altera os dados da plugin
                                                        plugin.name = request.param('name', plugin.name);
                                                        plugin.slug = request.param('slug', plugin.slug);
                                                        plugin.source = request.param('source', plugin.source);
                                                        //salva modificações
                                                        plugin.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send(plugin);
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