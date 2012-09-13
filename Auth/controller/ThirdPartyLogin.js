/** ThirstPartyLogin
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de contas externas de um usuário
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User;

    /** POST /user/:login/third-party-login
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastra login externo do usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {server, external_token, id, token}
     * @response : {confirmation}
     */
    app.post('/user/:login/third-party-login', function (request, response) {
        response.contentType('json');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, model : 'user' }});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidToken'}});
                        } else {
                            //Pega os dados do post e coloca em um objeto
                            user.thirdPartyLogins.push({
                                server : request.param('server', null),
                                token  : request.param('external_token', null),
                                id     : request.param('id', null)
                            });
                            //salva o login externo
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(user.thirdPartyLogins.pop());
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** GET /user/:login/third-party-logins
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : lista logins externos do usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {[{server}]}
     */
    app.get('/user/:login/third-party-logins', function (request, response) {
        response.contentType('json');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, model : 'user' }});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidToken'}});
                        } else {
                            response.send(user.thirdPartyLogins);
                        }
                    });
                }
            }
        });
    });

    /** GET /user/:login/third-party-login/:server
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : pega login externo
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {server}
     */
    app.get('/user/:login/third-party-login/:id', function (request, response) {
        response.contentType('json');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, model : 'user' }});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidToken'}});
                        } else {
                            //busca o login externo
                            user.findThirdPartyLogin(request.params.id, function (error, thirdPartyLogin) {
                                if (error) {
                                    response.send({error: error});
                                } else {
                                    //verifica se o login externo foi encontrado
                                    if (thirdPartyLogin === null) {
                                        response.send({error : { message : 'third-party-login not found', name : 'NotFoundError', id : request.params.id, model : 'third-party-login'}});
                                    } else {
                                        response.send(thirdPartyLogin);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });
    });

    /** DEL /user/:login/third-party-login/:server
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : remove login externo
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/user/:login/third-party-login/:id', function (request, response) {
        var i,
            thirdPartyLogin,
            found = false;

        response.contentType('json');

        //localiza o usuário
        User.findByIdentity(request.params.login, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : {message :  'user not found', name : 'NotFoundError', id : request.params.login, model : 'user' }});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : {message : 'invalid token', name : 'InvalidToken'}});
                        } else {
                            //busca o login externo
                            user.findThirdPartyLogin(request.params.id, function (error, thirdPartyLogin) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se o login externo foi encontrado
                                    if (thirdPartyLogin === null) {
                                        response.send({error : { message : 'third-party-login not found', name : 'NotFoundError', id : request.params.id, model : 'third-party-login'}});
                                    } else {
                                        //remove o login externo
                                        thirdPartyLogin.remove();
                                        user.save(function (error) {
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
                    });
                }
            }
        });
    });
};