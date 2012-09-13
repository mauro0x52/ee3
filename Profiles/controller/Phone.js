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
                                        response.send({phone : profile.phones.pop()});
                                    }
                                });
                            }
                        }
                    }
                });
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
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                } else {
                    response.send({phones : profile.phones});
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
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, model : 'profile'}});
                } else {
                    //busca telefone
                    profile.findPhone(request.params.id, function (error, phone) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se telefone foi encontrado
                            if (phone === null) {
                                response.send({error : { message : 'phone not found', name : 'NotFoundError', id : request.params.id, model : 'phone'}});
                            } else {
                                response.send({phone : phone});
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
                                //busca o telefone
                                profile.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //altera os dados do telefone
                                        phone.type = request.param('type', phone.type);
                                        phone.number = request.param('number', phone.number);
                                        phone.extension = request.param('extension', phone.extension);
                                        phone.areaCode = request.param('areaCode', phone.areaCode);
                                        phone.intCode = request.param('intCode', phone.intCode);
                                        //salva as alterações
                                        profile.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({phone : phone});
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                });
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
                                //busca o telefone
                                profile.findPhone(request.params.id, function (error, phone) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se telefone foi encontrado
                                        if (phone === null) {
                                            response.send({error : { message : 'phone not found', name : 'NotFoundError', id : request.params.id, model : 'phone'}});
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
            }
        });
    });
};