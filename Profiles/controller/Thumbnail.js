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
        files  = require('./../Utils.js').files,
        Profile = Model.Profile;

    /** POST /profile/:profile_id/thumbnail
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
    app.post('/profile/:profile_id/thumbnail', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(request.param('profile_id'), function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrado
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (!profile.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                // verifica se foi enviado algum arquivo
                                if (!request.files || !request.files.file) {
                                    response.send({error : 'no selected file'});
                                } else {
                                    // faz upload dos thumbnails
                                    files.image.thumbnail.upload(
                                        request.files.file,
                                        '/profiles/' + profile.slug + '/thumbnails',
                                        function (error, data) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                profile.thumbnail = {
                                                    original : {
                                                        file : data.original._id,
                                                        url : data.original.url,
                                                        title : 'thumbnail',
                                                        legend : 'original'
                                                    },
                                                    small : {
                                                        file : data.small._id,
                                                        url : data.small.url,
                                                        title : 'thumbnail',
                                                        legend : '50x50 thumbnail'
                                                    },
                                                    medium : {
                                                        file : data.medium._id,
                                                        url : data.medium.url,
                                                        title : 'thumbnail',
                                                        legend : '100x100 thumbnail'
                                                    },
                                                    large : {
                                                        file : data.large._id,
                                                        url : data.large.url,
                                                        title : 'thumbnail',
                                                        legend : '200x200 thumbnail'
                                                    }
                                                };
                                                profile.save(function (error) {
                                                    if (error) {
                                                        response.send({error: error});
                                                    }
                                                    else {
                                                        response.send(profile.thumbnail);
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });

    /** GET /profile/:profile_id/thumbnail
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar thumbnail
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{}]}
     */
    app.get('/profile/:profile_id/thumbnail', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.param('profile_id'), function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    response.send(profile.thumbnail);
                }
            }
        });
    });

    /** GET /profile/:profile_id/thumbnail/:size
     *
     * @autor : Rafael Erthal, Mauro Ribeiro
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
    app.get('/profile/:profile_id/thumbnail/:size', function (request, response) {
        response.contentType('json');

        var size = request.param('size');

        if (size !== 'original' && size !== 'large' && size !== 'medium' && size !== 'small' ) {
            size = 'small';
        }
        //busca o perfil
        Profile.findByIdentity(request.param('profile_id'), function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    if (profile.thumbnail[size]) {
                        response.send(profile.thumbnail[size]);
                    } else {
                        response.send({error : 'thumbnail ' + size + ' not found'});
                    }
                }
            }
        });
    });

    /** PUT /profile/:profile_id/thumbnail/:id
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
    app.put('/profile/:profile_id/thumbnail/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(profile_id, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (!profile.isOwner(user._id)) {
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

    /** DEL /profile/:profile_id/contact/:idContact/thumbnail/:id
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
    app.del('/profile/:profile_id/contact/:idContact/thumbnail/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(profile_id, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (!profile.isOwner(user._id)) {
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