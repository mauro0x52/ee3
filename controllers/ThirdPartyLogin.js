/** ThirstPartyLogin
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de contas externas de um usuário
 */
 
module.exports = function (app) {
    
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
     * @request : {server, token}
     * @response : {confirmation}
     */
    app.post('user/:login/third-party-login', function (request,response) {
        response.contentType('json');
        
        //localiza o usuário
        User.findOne({username : request.params.login}, function (user, error) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'usuário ou senha inválidos'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function(valid) {
                        if (!valid) {
                            response.send({error : 'token inválido'});
                        } else {
                            //Pega os dados do post e coloca em um objeto
                            user.thirdPartyLogins.push({
                                server : request.param('server', null),
                                token  : request.param('token', null),
                                id     : request.param('id', null)
                            });
                            //salva o login externo
                            user.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({error : ''});
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
    app.get('user/:login/third-party-logins', function (request,response) {
        response.contentType('json');
        
        //localiza o usuário
        User.findOne({username : request.params.login}, function (user, error) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'usuário ou senha inválidos'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function(valid) {
                        if (!valid) {
                            response.send({error : 'token inválido'});
                        } else {
                            response.send({thirdPartyLogins : user.thirdPartyLogins});
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
    app.get('user/:login/third-party-login/:server', function (request,response) {
        var i,
            found = false;

        response.contentType('json');
        
        //localiza o usuário
        User.findOne({username : request.params.login}, function (user, error) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'usuário ou senha inválidos'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function(valid) {
                        if (!valid) {
                            response.send({error : 'token inválido'});
                        } else {
                            //procura o login externo nos logins externos do usuário
                            for (i = 0; i < user.thirdPartyLogins.length; i++) {
                                if (user.thirdPartyLogins[i].server === request.params.server) {
                                    response.send({thirdPartyLogin : user.thirdPartyLogins[i]});
                                    found = true;
                                }
                            }
                            //caso não tenha sido achado, enviar mensagem de erro
                            if (!found) {
                                response.send({error : 'login externo não encontrado'});
                            }
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
    app.del('user/:login/third-party-login/:server', function (request,response) {
        var i,
            found = false;

        response.contentType('json');
        
        //localiza o usuário
        User.findOne({username : request.params.login}, function (user, error) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'usuário ou senha inválidos'});
                } else {
                    //verifica o token do usuário
                    user.checkToken(request.param('token', null), function(valid) {
                        if (!valid) {
                            response.send({error : 'token inválido'});
                        } else {
                            //procura o login externo nos logins externos do usuário
                            for (i = 0; i < user.thirdPartyLogins.length; i++) {
                                if (user.thirdPartyLogins[i].server === request.params.server) {
                                    //remove o login externo
                                    user.thirdPartyLogins[i].remove();
                                    user.save(function (error) {
                                        if (error) {
                                            response.send({error : error});
                                        } else {
                                            response.send({error : ''});
                                        }
                                    });
                                    found = true;
                                }
                            }
                            //caso não tenha sido achado, enviar mensagem de erro
                            if (!found) {
                                response.send({error : 'login externo não encontrado'});
                            }
                        }
                    });
                }
            }
        });
    });
};