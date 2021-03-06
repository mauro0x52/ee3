/** Contact
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de contato
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Profile = Model.Profile;

    /** POST /profile/:slug/contact
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar contato
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,address}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/contact', function (request, response) {
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
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                        } else {
                            //verifica se o usuário é dono da compania
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //coloca os dados do post em um objeto
                                profile.contacts.push({
                                    type : request.param('type', null),
                                    address : request.param('address', null)
                                });
                                //salva o contato
                                profile.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({contact : profile.contacts.pop()});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** GET /company/:slug/contacts
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar contatos
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{type,address}]}
     */
    app.get('/profile/:slug/contacts', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                } else {
                    response.send({contacts : profile.contacts});
                }
            }
        });
    });

    /** GET /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir contato
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {type,address}
     */
    app.get('/profile/:slug/contact/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.findByIdentity(request.params.slug, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                } else {
                    //busca o contato
                    profile.findContact(request.params.id, function (error, contact) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se contato foi encontrado
                            if (contact === null) {
                                response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                            } else {
                                response.send({contact : contact});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar contato
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,type,address}
     * @response : {confirmation}
     */
    app.put('/profile/:slug/contact/:id', function (request, response) {
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
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o contato
                                profile.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                        } else {
                                            //altera os dados do contato
                                            contact.type = request.param('type', contact.type);
                                            contact.address = request.param('address', contact.address);
                                            //salva as alterações
                                            profile.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({contact : contact});
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

    /** DEL /company/:slug/contact/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir contato
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/profile/:slug/contact/:id', function (request, response) {
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
                            response.send({error : { message : 'profile not found', name : 'NotFoundError', id : request.params.slug, path : 'profile'}});
                        } else {
                            //verifica se o usuário é dono do perfil
                            if (! profile.isOwner(user._id)) {
                                response.send({ error : { message : 'permission denied', name : 'PermissionDeniedError'}});
                            } else {
                                //busca o contato
                                profile.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : { message : 'contact not found', name : 'NotFoundError', id : request.params.id, path : 'contact'}});
                                        } else {
                                            //remove o contato
                                            contact.remove();
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