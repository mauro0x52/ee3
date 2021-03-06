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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
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
                        response.send({app : app});
                    }
                });
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        App.find(function (error, apps) {
            if (error) {
                response.send({error : error});
            } else {
                response.send({apps : apps});
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
        response.header('Access-Control-Allow-Origin', '*');

        //busca todos os apps
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : { message : 'app not found', name : 'NotFoundError', id : request.params.slug, path : 'app'}});
                } else {
                    response.send({app : app});
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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({ error : error });
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
                                response.send({error : { message : 'permission denied', name : 'PermissionDeniedError'}});
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
        response.header('Access-Control-Allow-Origin', '*');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({ error : error });
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
                                response.send({error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //altera os dados do aplicativo
                                app.name = request.param('name', app.name);
                                app.type = request.param('type', app.type);
                                //salva as modificações
                                app.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({app : app});
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