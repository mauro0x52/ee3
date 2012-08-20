/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de profiles de usuários
 */

module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('./../Utils.js').auth,
        Profile  = Model.Profile;

    /** GET /profile/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Visualiza um Perfil
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Público
     *
     * @request : {slug}
     * @response : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links}
     */
    app.get('/profile/:slug', function (request,response) {
        response.contentType('json');
        
        //Localiza o Profile
        Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error: error});
            } else {
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    response.send({profile: profile});
                }
            }
        });
    });

    /** POST /profile
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Cadastra novo profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links, login, token}
     * @response : {this}
     */
    app.post('/profile', function (request,response) {
        var profile;

        response.contentType('json');
        //Verifica se o usuário logado é válido
        auth(request.param('token'), function (user) {
            if (user) {
                //Cria o Objeto Profile para adicionar no Model
                profile = new Profile({
                    userId        : user._id,
                    name        : request.param('name', null),
                    surname     : request.param('surname', null),
                    about       : request.param('about', null),
                    dateCreated : new Date(),
                    dateUpdated : new Date()
                });
                
                //Salva o objeto no Model de Profile e retorna o objeto para o solicitante
                profile.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send(profile);
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        })
    });

    /** PUT /profile/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Edita um profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {slugs, name, surname, about, login, token}
     * @response : {this}
     */
    app.put('/profile/:slug', function (request,response) {
        response.contentType('json');
        
        //Verifica se o usuário logado é válido
        auth(request.param('token'), function (user) {
            if (user) {
                //Localiza o Profile
                Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        //Verifica se o Profile foi encontrado
                        if (profile === null) {
                            response.send({error : "profile not found"});
                        } else {
                            profile.name = request.param('name', null);
                            profile.surname = request.param('surname', null);
                            profile.about = request.param('about', null);
                            profile.dateUpdated = new Date();
                            profile.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send(profile);
                                }
                            });
                        }
                    }
                });
            } else {
                request.send({error : 'invalid token'});
            }
        });
    });

    /** DEL /profile/:slug
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Excluir profile
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('/profile/:slug', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token', null), function (user) {
            if (user) {
                //busca o profile
                Profile.findOne({"slugs" : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o profile foi encontrado
                        if (profile === null) {
                            response.send({error : 'profile not found'});
                        } else {
                            //remove o profile
                            profile.remove(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({error : ''});
                                }
                            });
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });
};