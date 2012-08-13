/** Thumbnail
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de thumbnail
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Profile = Model.Profile;

    /** POST /profile/:slug/thumbnail
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar thumbnail
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/thumbnail', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
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
                                profile.thumbnails.push({
                                     small  : request.param('small'),
                                     medium : request.param('medium'),
                                     large  : request.param('large')
                                });
                                //salva o thumbnail
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

    /** GET /profile/:slug/thumbnails
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar thumbnails
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{}]}
     */
    app.get('/profile/:slug/thumbnails', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    response.send({thumbnails : profile.thumbnails});
                }
            }
        });
    });

    /** GET /profile/:slug/thumbnail/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir thumbnail
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {}
     */
    app.get('/company/:slug/thumbnail/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    //busca thumbnail
                    profile.findThumbnail(request.params.id, function (error, thumbnail) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se thumbnail foi encontrado
                            if ( === null) {
                                response.send({error : 'thumbnail not found'});
                            } else {
                                response.send({thumbnail : thumbnail});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /profile/:slug/thumbnail/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar thumbnail
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.put('/profile/:slug/thumbnail/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
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
                                //busca o thumbnail
                                profile.findThumbnail(request.params.id, function (error, thumbnail) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o thumbnail foi encontrado
                                        if (thumbnail === null) {
                                            response.send({error : 'thumbnail not found'});
                                        } else {
                                            //altera os dados do thumbnail
                                            profile.thumbnails.push({
                                                 small  : request.param('small'),
                                                 medium : request.param('medium'),
                                                 large  : request.param('large')
                                            });
                                            //salva as alterações
                                            thumbnail.save(function (error) {
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

    /** DEL /profile/:slug/contact/:idContact/thumbnail/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir thumbnail
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/profile/:slug/contact/:idContact/thumbnail/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
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
                                //busca o thumbnail
                                profile.findThumbnail(request.params.id, function (error, thumbnail) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se thumbnail foi encontrado
                                        if (thumbnail === null) {
                                            response.send({error : 'thumbnail not found'});
                                        } else {
                                            //remove o thumbnail
                                            thumbnail.remove(function (error) {
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