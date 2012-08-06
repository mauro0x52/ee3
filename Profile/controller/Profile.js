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
     * @request : {}
     * @response : {jobs, slugs, name, surname, thumbnail, about, phones, contacts, links}
     */
    app.get('/profile/:slug', function (request,response) {
        response.contentType('json');
        
        //Localiza o Profile
        Profile.findOne({"slugs.name" : request.params.slug}, function (error, profile) {
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
        auth(request.param('login'), request.param('token'), function (valid) {
            if (valid) {
                //Cria o Objeto Profile para adicionar no Model
                profile = new Profile({
                    users       : request.param('login', null),
                    jobs        : request.param('jobs', null),
                    slugs       : request.param('slugs', null),
                    name        : request.param('name', null),
                    surname     : request.param('surname', null),
                    thumbnail   : request.param('thumbnails', null),
                    about       : request.param('about', null),
                    phones      : request.param('phones', null),
                    contacts    : request.param('contacts', null),
                    links       : request.param('links', null),
                    dateCreated : new Date(),
                    dateUpdated : new Date()
                });
                //Salva o objeto no Model de Profile e retorna o objeto para o solicitante
                profile.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({error : ''});
                    }
                });
            } else {
                request.send({error : 'invalid token'});
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
        auth(request.param('login'), request.param('token'), function (valid) {
            if (valid) {
                //Localiza o Profile
                Profile.findOne({"slugs.name" : request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        //Verifica se o Profile foi encontrado
                        if (profile === null) {
                            response.send({error : "profile not found"});
                        } else {
                            this.name = request.param('name', null);
                            this.slugs = request.param('slugs', null);
                            this.surname = request.param('surname', null);
                            this.about = request.param('about', null);
                            this.dateUpdated = new Date();
                            this.save(function (error) {
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
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o profile
                Profile.findOne({"slugs.name" : request.params.slug}, function (error, profile) {
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