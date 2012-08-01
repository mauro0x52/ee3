/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de profiles de usuários
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        Profile  = Model.Profile;

    /** GET /profile/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Visualiza um Perfil
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Público
     *
     * @request : {}
     * @response : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links}
     */
    app.get('/profile/:slug', function (request,response) {
        response.contentType('json');
        
        //Verifica se existe o parametro Slug
        if (request.params.slug) {
            //Localiza o Profile
            Profile.findProfileForSlug(request.params.slug, function (error, profile) {
                if (error) {
                    response.send({error: error});
                } else {
                    //Verifica se o Profile foi encontrado
                    if (profile === null) {
                        response.send({error: "Profile não encontrado."});
                    } else {
                        //Enviar os dados do Profile para o solicitante
                        response.send({Profile: profile});
                    }
                }
            });
        } else {
            response.send({error: "É necessário o envio de uma slug"});
        }
    });
    
    
    /** POST /profile
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Cadastra novo profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links}
     * @response : {this}
     */
    app.post('/user', function (request,response) {
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
    app.put('/user/:login/deactivate', function (request,response) {
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
                    user.checkToken(request.param('token', null), function(valid) {
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
    app.put('/user/:login/activate', function (request,response) {
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
                    user.checkToken(request.param('token', null), function(valid) {
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
    app.put('/user/:login/password-recovery', function (request,response) {
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
                        user.checkToken(request.param('token', null), function(valid) {
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
    app.put('/user/:login/login', function (request,response) {
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
                                response.send({token : this.token, error : ''});
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
    app.put('/user/:login/logout', function (request,response) {
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
                    user.checkToken(request.param('token', null), function(valid) {
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
    app.get('/user/:login/validate', function (request,response) {
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
                    user.checkToken(request.param('token', null), function(valid) {
                        response.send({valid : valid, error : ''});
                    });
                }
            }
        });
    });
};