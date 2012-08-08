/** User
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de conta de usuário
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        User  = Model.User;

    /** POST /user
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastra novo usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {username, password, password_confirmation}
     * @response : {token, confirmation}
     */
    app.post('/user', function (request, response) {
        var user;

        response.contentType('json');

        // valida se a senha e a confirmação senha conferem
        if (request.param('password', null) === request.param('password_confirmation', null)) {
            //pega os dados do post e coloca em um novo objeto
            user = new User({
                username : request.param('username', null),
                password : request.param('password', null),
                status   : 'active'
            });
            //salva novo usuário
            user.save(function (error) {
                if (error) {
                    response.send({error : error});
                } else {
                    //loga o usuário no sistema                    
                    user.login(function (error) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({error : '', token : user.token});
                        }
                    });
                }
            });
        } else {
            response.send({error : 'Password confirmation invalid'});
        }
    });

    /** PUT /user/:login/deactivate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : desativa conta do usuário
     *
     * @allowedApp : Aplicativo: Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.put('/user/:login/deactivate', function (request, response) {
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
                    //checa token
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //desativa a conta do usuário
                            user.deactivate(function (error) {
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

    /** PUT /user/:login/activate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : ativa conta do usuário
     *
     * @allowedApp: Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.put('/user/:login/activate', function (request, response) {
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
                    //checa token
                    user.checkToken(request.param('token', null), function (valid) {
                        if (!valid) {
                            response.send({error : 'invalid token'});
                        } else {
                            //ativa a conta do usuário
                            user.activate(function (error) {
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

    /** PUT /user/:login/password-recovery
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : recupera senha do usuário
     *
     * @allowedApp : Apenas o www, redirecionamento por e-mail
     * @allowedUser : Público
     *
     * @request : {token, newpassword, newpasswordconfirmation}
     * @response : {newtoken, confirmation}
     */
    app.put('/user/:login/password-recovery', function (request, response) {
        response.contentType('json');

        // valida se a senha e a confirmação senha conferem
        if (request.param('newpassword', null) === request.param('newpasswordconfirmation', null)) {
            //localiza o usuário
            User.findOne({username : request.params.login}, function (error, user) {
                if (error) {
                    response.send({error : error});
                } else {
                    //verifica se o usuario foi encontrado
                    if (user === null) {
                        response.send({error : 'user not found'});
                    } else {
                        //checa token
                        user.checkToken(request.param('token', null), function (valid) {
                            if (!valid) {
                                response.send({error : 'invalid token'});
                            } else {
                                //altera a senha
                                user.changePassword(request.param('newpassword', null), function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //reloga o usuário
                                        user.login(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({token : this.token, error : ''});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        } else {
            response.send({error : 'Password confirmation invalid'});
        }
    });

    /** PUT /user/:login/login
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : autentica o usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {login, password}
     * @response : { token, confirmation}
     */
    app.put('/user/:login/login', function (request, response) {
        response.contentType('json');

        //localiza o usuário
        User.findOne({username : request.params.login}, function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuario foi encontrado
                if (user === null) {
                    response.send({error : 'invalid username or password'});
                } else {
                    //verifica a senha do usuário
                    if (user.password !== request.param('password', null)) {
                        response.send({error : 'invalid username or password'});
                    } else {
                        //loga o usuário
                        user.login(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({token : user.token, error : ''});
                            }
                        });
                    }
                }
            }
        });
    });

    /** PUT /user/:login/logout
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : desautentica o usuário
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.put('/user/:login/logout', function (request, response) {
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
                            //desloga o usuário
                            user.logout(function (error) {
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

    /** GET /user/:login/validate
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
     * @response : {confirmation}
     */
    app.get('/user/:login/validate', function (request, response) {
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
                        response.send({valid : valid, error : ''});
                    });
                }
            }
        });
    });
};