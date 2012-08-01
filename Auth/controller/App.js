/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades autorização de aplicativos
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User,
        crypto = require('crypto');

    /** POST /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Autoriza o usuário no app
     *
     * @allowedApp : WWW
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {token, confirmation}
     */
    app.post('/user/:login/app/:app_id', function (request, response) {
        var token;

        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'user not found'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //gera o token
                            token = crypto.createHash('md5').update(user.login + user.password + request.params.app_id).digest('hex');
                            //pega os dados do post e coloca em um objeto
                            user.authorizedApps.push({
                                appId             : request.params.app_id,
                                token             : token,
                                authorizationDate : new Date()
                            });
                            //salva a autorização
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({error : '', token : token});
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** DEL /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : remove autorização do usuário no app
     *
     * @allowedApp : WWW
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/user/:login/app/:app_id', function (request, response) {
        var i,
            authorizedApp,
            found = false;

        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'user not found'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //busca a autorização de app nos apps autorizados do usuário
                            for (i = 0; i < user.authorizedApps.length; i = i + 1) {
                                if (user.authorizedApps[i].appId === request.params.app_id) {
                                    authorizedApp = i;
                                    found = true;
                                }
                            }
                            //caso não tenha sido achado, enviar mensagem de erro
                            if (!found) {
                                response.send({error : 'auth not found'});
                            } else {
                                //remove autorização de app
                                user.authorizedApps[authorizedApp].remove();
                                user.save(function (error) {
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
    });

    /** GET /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : detalha a autorização do usuario no app
     *
     * @allowedApp : WWW, pagamento, appFinder
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {authorizationDate,  expirationDate}
     */
    app.get('/user/:login/app/:app_id', function (request, response) {
        var i,
            found = false;

        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'user not found'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //busca a autorização de app nos apps autorizados do usuário
                            for (i = 0; i < user.authorizedApps.length; i = i + 1) {
                                if (user.authorizedApps[i].appId === request.params.app_id) {
                                    //envia dados da autorização
                                    response.send({error : '', authorizedApp : user.authorizedApps[i]});
                                    found = true;
                                }
                            }
                            //caso não tenha sido achado, enviar mensagem de erro
                            if (!found) {
                                response.send({error : 'auth not found'});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : edita detalhes da autorização do usuário no app
     *
     * @allowedApp : WWW, pagamento
     * @allowedUser : Logado
     *
     * @request : {authorizationDate, expirationDate, token}
     * @response : {confirmation}
     */
    app.put('/user/:login/app/:app_id', function (request, response) {
        var i,
            authorizedApp,
            found = false;

        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'user not found'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //busca a autorização de app nos apps autorizados do usuário
                            for (i = 0; i < user.authorizedApps.length; i = i + 1) {
                                if (user.authorizedApps[i].appId === request.params.app_id) {
                                    authorizedApp = i;
                                    found = true;
                                }
                            }
                            //caso não tenha sido achado, enviar mensagem de erro
                            if (!found) {
                                response.send({error : 'auth not found'});
                            } else {
                                //edita dados da autorização
                                user.authorizedApps[authorizedApp].authorizationDate = request.param('authorizationDate', null);
                                user.authorizedApps[authorizedApp].expirationDate = request.param('expirationDate', null);
                                //salva dados da autorização
                                user.save(function (error) {
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
    });

    /** GET /user/:login/app/:app_id/validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida token
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {valid}
     */
    app.get('/user/:login/app/:app_id/validate', function (request, response) {
        var i,
            found = false;

        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'user not found'});
                } else {
                    //busca a autorização de app nos apps autorizados do usuário
                    for (i = 0; i < user.authorizedApps.length; i = i + 1) {
                        if (user.authorizedApps[i].appId === request.params.app_id) {
                            //valida o token
                            response.send({valid : user.authorizedApps[i].token === request.param('token', null), error : ''});
                            found = true;
                        }
                    }
                    //caso não tenha sido achado, enviar mensagem de erro
                    if (!found) {
                        response.send({error : 'auth not found'});
                    }
                }
            }
        });
    });

};