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
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrado
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //coloca os dados do post em um objeto
                                profile.links.push({
                                    type : request.param('type', null),
                                    url : request.param('url', null)
                                });
                                //salva o link
                                profile.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({link : profile.links.pop()});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** GET /profile/:slug/links
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
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                } else {
                    response.send({links : profile.links});
                }
            }
        });
    });

    /** GET /profile/:slug/link/:id
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
    app.get('/profile/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                } else {
                    //busca link
                    profile.findLink(request.params.id, function (error, link) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se link foi encontrado
                            if (link === null) {
                                response.send({error : { message : 'link not found', name : 'NotFoundError', id : request.params.id, model : 'link'}});
                            } else {
                                response.send({link : link});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /profile/:slug/link/:id
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
    app.put('/profile/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o link
                                profile.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o link foi encontrado
                                        if (link === null) {
                                            response.send({error : { message : 'link not found', name : 'NotFoundError', id : request.params.id, model : 'link'}});
                                        } else {
                                            //altera os dados do link
                                            link.type = request.param('type', link.type);
                                            link.url = request.param('url', link.url);
                                            //salva as alterações
                                            profile.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({link : link});
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** DEL /profile/:slug/link/:id
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
    app.del('/profile/:slug/link/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (error, user) {
            if (error) {
                response.send({error : error});
            } else {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o link
                                profile.findLink(request.params.id, function (error, link) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se link foi encontrado
                                        if (link === null) {
                                            response.send({error : { message : 'link not found', name : 'NotFoundError', id : request.params.id, model : 'link'}});
                                        } else {
                                            //remove o link
                                            link.remove();
                                            profile.save(function (error) {
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
                        }
                    }
                });
            }
        });
    });
};