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
                                profile.contacts.push({
                                    type : request.param('type', null),
                                    address : request.param('address', null)
                                });
                                //salva o contato
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
        Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
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
    app.get('/company/:slug/contact/:id', function (request, response) {
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
                    //busca o contato
                    profile.findContact(request.params.id, function (error, contact) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se contato foi encontrado
                            if (contact === null) {
                                response.send({error : 'contact not found'});
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
    app.put('/company/:slug/contact/:id', function (request, response) {
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
                                //busca o contato
                                profile.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : 'contact not found'});
                                        } else {
                                            //altera os dados do contato
                                            contact.type = request.param('type', null);
                                            contact.address = request.param('address', null);
                                            //salva as alterações
                                            contact.save(function (error) {
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
    app.del('/company/:slug/contact/:id', function (request, response) {
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
                                //busca o contato
                                profile.findContact(request.params.id, function (error, contact) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se contato foi encontrado
                                        if (contact === null) {
                                            response.send({error : 'contact not found'});
                                        } else {
                                            //remove o contato
                                            contact.remove(function (error) {
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