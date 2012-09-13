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
    app.post('/profile/:profile_id/thumbnail', function postProfileThumbnail(request, response) {
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
                                                        response.send({thumbnail : profile.thumbnail});
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
                    response.send({thumbnail : profile.thumbnail});
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
                    if (profile.thumbnail[size] && profile.thumbnail[size].url) {
                        response.send({size : profile.thumbnail[size]});
                    } else {
                        response.send(null);
                    }
                }
            }
        });
    });

    /** PUT /profile/:profile_id/thumbnail/
     *
     * @autor : Mauro Ribeiro
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
    app.put('/profile/:profile_id/thumbnail', function (request, response) {
        postProfileThumbnail(request, response);
    });

    /** DEL /profile/:profile_id/thumbnail/
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
    app.del('/profile/:profile_id/thumbnail', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (!user) {
                response.send({error : 'invalid token'});
            } else {
                //busca o perfil
                Profile.findByIdentity(request.param('profile_id'), function (error, profile) {
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
                                profile.thumbnail = null;
                                profile.save(function (error) {
                                    if (error) {
                                        response.send({error: error});
                                    }
                                    else {
                                        response.send(null);
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