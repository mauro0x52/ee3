/** Link
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de link
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Profile = Model.Profile;

    /** POST /profile/:slug/link
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar link
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,url}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/link', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.find({slug : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrado
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! profile.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //coloca os dados do post em um objeto
                                profile.links.push({
                                    type : request.param('type', null),
                                    utl : request.param('url', null)
                                });
                                //salva o link
                                profile.save(function (error) {
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

    /** GET /company/:slug/links
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar links
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,url}]}
     */
    app.get('/profile/:slug/links', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.find({slug : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    response.send({links : profile.links});
                }
            }
        });
    });

    /** GET /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir link
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,url}
     */
    app.get('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.find({slug : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    //busca link
                    profile.findLink(request.params.id, function (error, link) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se link foi encontrado
                            if ( === null) {
                                response.send({error : 'link not found'});
                            } else {
                                response.send({link : link});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar link
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,url}
     * @response : {confirmation}
     */
    app.put('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.find({slug : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o link
                                profile.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrado
                                        if (link === null) {
                                            response.send({error : 'link not found'});
                                        } else {
                                            //altera os dados do link
                                            link.type = request.param('type', null);
                                            link.url = request.param('url', null);
                                            //salva as alterações
                                            link.save(function (error) {
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

    /** DEL /company/:slug/link/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir link
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/company/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.find({slug : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(request.param('login', null))) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o link
                                profile.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se link foi encontrado
                                        if (link === null) {
                                            response.send({error : 'link not found'});
                                        } else {
                                            //remove o link
                                            link.remove(function (error) {
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