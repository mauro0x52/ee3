/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de dialogos
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        App  = Model.App,
        Dialog  = Model.Dialog;

    /** POST /app/:slug/dialog
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar dialogo
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {name,code,token}
     * @response : {confirmation}
     */
    app.post('/app/:slug/version/:number/dialog', function (request, response) {
        var dialog;

        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

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
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : { message : 'permission denied', name : 'PermissionDeniedError' }});
                            } else {
                                //busca a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, path : 'version'}});
                                        } else {
                                            //pega os dados do post e coloca em um objeto
                                            dialog = new Dialog({
                                                name      : request.param('name', null),
                                                source    : request.param('source', null),
                                                slug      : request.param('slug', null),
                                                version   : version._id
                                            });
                                            //salva a nova dialogo
                                            dialog.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({dialog : dialog});
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

    /** GET /app/:slug/version/:number/dialogs
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar dialogos
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{number}]}
     */
    app.get('/app/:slug/version/:number/dialogs', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca o app
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                } else {
                    //pega versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, path : 'version'}});
                            } else {
                                //pega dialogos
                                version.dialogs(function (error, dialogs) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({dialogs : dialogs});
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });

    /** GET /app/:slug/version/:number/dialog/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir dialogo
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {number}
     */
    app.get('/app/:slug/version/:number/dialog/:name', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

        //busca o app
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                } else {
                    //pega a versão do app
                    app.findVersion(request.params.number, function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, path : 'version'}});
                            } else {
                                version.findDialog(request.params.name, function (error, dialog) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a ferramente foi encontrada
                                        if (dialog === null) {
                                            response.send({error : { message : 'dialog not found', name : 'NotFoundError', id : request.params.name, path : 'dialog'}});
                                        } else {
                                            response.send({dialog : dialog});
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

    /** DEL /app/:slug/version/:number/dialog/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir dialogo
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/app/:slug/version/:number/dialog/:name', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

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
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : {message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, path : 'version'}});
                                        } else {
                                            //pega a dialogo
                                            version.findDialog(request.params.name, function (error, dialog) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a dialogo foi encontrada
                                                    if (dialog === null) {
                                                        response.send({error : { message : 'dialog not found', name : 'NotFoundError', id : request.params.name, path : 'dialog'}});
                                                    } else {
                                                        //remove a dialogo
                                                        dialog.remove(function (error) {
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

    /** PUT /app/:slug/version/:number/dialog/:name
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar dialogo
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {number,token,name,code}
     * @response : {confirmation}
     */
    app.put('/app/:slug/version/:number/dialog/:oldname', function (request, response) {
        response.contentType('json');
        response.header('Access-Control-Allow-Origin', '*');

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
                            response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                        } else {
                            //verifica se o usuário é o criador do app
                            if (user._id !== app.creator) {
                                response.send({error : {message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //pega a versão
                                app.findVersion(request.params.number, function (error, version) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se a versão foi encontrada
                                        if (version === null) {
                                            response.send({error : { message : 'version not found', name : 'NotFoundError', id : request.params.number, path : 'version'}});
                                        } else {
                                            //busca a dialogo
                                            version.findDialog(request.params.oldname, function (error, dialog) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a dialogo foi encontrada
                                                    if (dialog === null) {
                                                        response.send({error : { message : 'dialog not found', name : 'NotFoundError', id : request.params.name, path : 'dialog'}});
                                                    } else {
                                                        //altera os dados da dialogo
                                                        dialog.name = request.param('name', dialog.name);
                                                        dialog.slug = request.param('slug', dialog.slug);
                                                        dialog.source = request.param('source', dialog.source);
                                                        //salva modificações
                                                        dialog.save(function (error) {
                                                            if (error) {
                                                                response.send({error : error});
                                                            } else {
                                                                response.send({dialog : dialog});
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