/** Phone
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de telefone
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Profile = Model.Profile;

    /** POST /profile/:slug/phone
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar telefone
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,number,extension,areaCode,intCode}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/phone', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrado
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! profile.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                //coloca os dados do post em um objeto
                                profile.phones.push({
                                    type      : request.param('type', null),
                                    number    : request.param('number', null),
                                    extension : request.param('extension', null),
                                    areaCode  : request.param('areaCode', null),
                                    intCode   : request.param('intCode', null),
                                });
                                //salva o telefone
                                profile.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send(profile.phones.pop());
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

    /** GET /profile/:slug/phones
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar telefones
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,number,extension,areaCode,intCode}]}
     */
    app.get('/profile/:slug/phones', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    response.send(profile.phones);
                }
            }
        });
    });

    /** GET /profile/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir telefone
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,number,extension,areaCode,intCode}
     */
    app.get('/profile/:slug/phone/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    //busca telefone
                    profile.findPhone(request.params.id, function (error, phone) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se telefone foi encontrado
                            if (phone === null) {
                                response.send({error : 'phone not found'});
                            } else {
                                response.send(phone);
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /profile/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar telefone
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,number,extension,areaCode,intCode}
     * @response : {confirmation}
     */
    app.put('/profile/:slug/phone/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o telefone
                                profile.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //altera os dados do telefone
                                        phone.type = request.param('type', null);
                                        phone.number = request.param('number', null);
                                        phone.extension = request.param('extension', null);
                                        phone.areaCode = request.param('areaCode', null);
                                        phone.intCode = request.param('intCode', null);
                                        //salva as alterações
                                        profile.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send(phone);
                                            }
                                        });
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

    /** DEL /profile/:slug/phone/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir telefone
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/profile/:slug/phone/:id', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o perfil
                Profile.findByIdentity(request.params.slug, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o perfil foi encontrada
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({error : 'permission denied'});
                            } else {
                                //busca o telefone
                                profile.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se telefone foi encontrado
                                        if (phone === null) {
                                            response.send({error : 'phone not found'});
                                        } else {
                                            //remove o telefone
                                            phone.remove();
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
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
};