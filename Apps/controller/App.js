/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de aplicativos
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        App  = Model.App;

    /** POST /app
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token,name,type}
     * @response : {confirmation}
     */
    app.post('/app', function (request, response) {
        var app;

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //pega os dados do post e coloca em um novo objeto
                app = new App({
                    name    : request.param('name', null),
                    creator : user._id,
                    type    : request.param('type', null)
                });
                //salva novo app
                app.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(app);
                    }
                });
            } else {
                    response.send({error : 'invalid user or token'});
            }
        });
    });

    /** GET /apps
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar apps
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */
    app.get('/apps', function (request, response) {
        response.contentType('json');

        //busca todos os apps
        App.find(function (error, apps) {
            if (error) {
                response.send({error : error});
            } else {
                response.send(apps);
            }
        });
    });

    /** GET /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir app
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */
    app.get('/app/:slug', function (request, response) {
        response.contentType('json');

        //busca todos os apps
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : 'app not found'});
                } else {
                    response.send(app);
                }
            }
        });
    });

    /** DEL /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/app/:slug', function (request, response) {
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
                                //remove o aplicativo
                                app.remove(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(null);
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

    /** PUT /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token,name,type}
     * @response : {}
     */
    app.put('/app/:slug', function (request, response) {
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
                                //altera os dados do aplicativo
                                app.name = request.param('name', app.name);
                                app.type = request.param('type', app.type);
                                //salva as modificações
                                app.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(app);
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