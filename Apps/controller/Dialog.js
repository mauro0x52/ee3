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
     * @request : {name,code}
     * @response : {confirmation}
     */
    app.post('/app/:slug/version/:number/dialog', function (request, response) {
        var dialog;

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
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
                                            dialog = new Dialog({
                                                name      : request.param('name', null),
                                                source    : request.param('code', null),
                                                versionId : version._id
                                            });
                                            //salva a nova dialogo
                                            dialog.save(function (error) {
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

        //busca o app
        App.find({slug : request.params.slug}, function (error, app) {
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

        //busca o app
        App.find({slug : request.params.slug}, function (error, app) {
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
                                version.findDialog(request.params.name, function (error, dialog) {
                                    if (error) {
                                        console.log({error : error});
                                    } else {
                                        //verifica se a ferramente foi encontrada
                                        if (dialog === null) {
                                            response.send({error : 'dialog not found'});
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

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
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
                                            //pega a dialogo
                                            version.findDialog(request.params.name, function (error, dialog) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a dialogo foi encontrada
                                                    if (dialog === null) {
                                                        response.send({error : 'dialog not found'});
                                                    } else {
                                                        //remove a dialogo
                                                        dialog.remove(function (error) {
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
     * @request : {number}
     * @response : {confirmation}
     */
    app.put('/app/:slug/version/:number/dialog/:name', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
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
                                            //busca a dialogo
                                            version.findDialog(request.params.name, function (error, dialog) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    //verifica se a dialogo foi encontrada
                                                    if (dialog === null) {
                                                        response.send({error : 'dialog not found'});
                                                    } else {
                                                        //altera os dados da dialogo
                                                        dialog.name = request.param('name', null);
                                                        dialog.code = request.param('code', null);
                                                        //salva modificações
                                                        dialog.save(function (error) {
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