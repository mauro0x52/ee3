/** Version
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de versões
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        Auth  = require('./../Utils.js').auth,
        App  = Model.App,
        Version  = Model.Version;
        
    /** POST /app/:slug/version
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar versão
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {token,number}
     * @response : {confirmation}
     */
    app.post('/app/:slug/version', function (request, response) {
        var version;
        
        response.contentType('json');
        
        //valida o token do usuário
        Auth(request.param('login', null), request.param('token', null), function (valid) {
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
                                //coloca os dados do post em um objeto
                                version = new Version({
                                    number : request.param('number', null),
                                    appId  : app._id
                                });
                                //salva a versão
                                version.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({error : ''});
                                    }
                                });
                            }
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
    
    /** GET /app/:slug/versions
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar versões
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{number}]}
     */
    app.get('/app/:slug/versions', function (request, response) {
        response.contentType('json');
        
        //busca o app        
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : 'app not found'});
                } else {
                    //pega as versões do app
                    app.versions(function (error, versions) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            response.send({versions : versions});
                        }
                    });
                }
            }
        });
    });
        
    /** GET /app/:slug/version/:number
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir versão
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token}
     * @response : {number}
     */
    app.get('/app/:slug/version/:number', function (request, response) {
        response.contentType('json');
        
        //busca o app
        App.findOne({slug : request.params.slug}, function (error, app) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o app foi encontrado
                if (app === null) {
                    response.send({error : 'app not found'});
                } else {
                    //pega a versão do app
                    app.findVersion(request.params.number ,function (error, version) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se a versão foi encontrada
                            if (version === null) {
                                response.send({error : 'version not foud'});
                            } else {
                                response.send({version : version});
                            }
                        }
                    });
                }
            }
        });
    });
        
    /** DEL /app/:slug/version/:number
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir versão
     *
     * @allowedApp : sdk
     * @allowedUser : Logado 
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/app/:slug/version/:number', function (request, response) {        
        response.contentType('json');
        
        //valida o token do usuário
        Auth(request.param('login', null), request.param('token', null), function (valid) {
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
                                            //remove a versão
                                            version.remove(function (error) {
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
                response.send({error : 'invalid token'});
            }
        });
    });
        
    /** PUT /app/:slug/version/:number
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar versão
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {number}
     * @response : {confirmation}
     */
    app.put('/app/:slug/version/:number', function (request, response) {
        response.contentType('json');
        
        //valida o token do usuário
        Auth(request.param('login', null), request.param('token', null), function (valid) {
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
                                            //altera os dados da versão
                                            version.number = request.param('number', null);
                                            //salva as modificações
                                            version.save(function (error) {
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
                response.send({error : 'invalid token'});
            }
        });
    });
};