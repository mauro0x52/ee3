/** Job
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de trabalho
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Profile = Model.Profile;

    /** POST /profile/:slug/job
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Cadastrar trabalho
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,company,companyName,description,dateStart,dateEnd}
     * @response : {confirmation}
     */
    app.post('/profile/:slug/job', function (request, response) {
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
                                profile.jobs.push({
                                    name : request.param('name', null),
                                    company : request.param('company', null),
                                    companyName : request.param('companyName', null),
                                    description : request.param('description', null),
                                    dateStart : request.param('dateStart', null),
                                    dateEnd : request.param('dateEnd', null)
                                });
                                //salva o trabalho
                                profile.save(function (error) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        response.send({job : profile.jobs.pop()});
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });
    });

    /** GET /company/:slug/jobs
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Listar trabalhos
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[{company,companyName,description,dateStart,dateEnd}]}
     */
    app.get('/profile/:slug/jobs', function (request, response) {
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
                    response.send({jobs : profile.jobs});
                }
            }
        });
    });

    /** GET /company/:slug/job/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Exibir trabalho
     *
     * @allowedApp : Profiles
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {company,companyName,description,dateStart,dateEnd}
     */
    app.get('/profile/:slug/job/:id', function (request, response) {
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
                    //busca trabalho
                    profile.findJob(request.params.id, function (error, job) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se trabalho foi encontrado
                            if (job === null) {
                                response.send({error : { message : 'job not found', name : 'NotFoundError', id : request.params.id, path : 'job'}});
                            } else {
                                response.send({job : job});
                            }
                        }
                    });
                }
            }
        });
    });

    /** PUT /company/:slug/job/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Editar trabalho
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token,company,companyName,description,dateStart,dateEnd}
     * @response : {confirmation}
     */
    app.put('/profile/:slug/job/:id', function (request, response) {
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
                                //busca o trabalho
                                profile.findJob(request.params.id, function (error, job) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o trabalho foi encontrado
                                        if (job === null) {
                                            response.send({error : { message : 'job not found', name : 'NotFoundError', id : request.params.id, path : 'job'}});
                                        } else {
                                            //altera os dados do trabalho
                                            job.company = request.param('company', job.company);
                                            job.name = request.param('name', job.name);
                                            job.companyName = request.param('companyName', job.companyName);
                                            job.description = request.param('description', job.description);
                                            job.dateStart = request.param('dateStart', job.dateStart);
                                            job.dateEnd = request.param('dateEnd', job.dateEnd);
                                            //salva as alterações
                                            profile.save(function (error) {
                                                if (error) {
                                                    response.send({error : error});
                                                } else {
                                                    response.send({job : job});
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

    /** DEL /company/:slug/job/:id
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : Excluir trabalho
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {login,token}
     * @response : {confirmation}
     */
    app.del('/profile/:slug/job/:id', function (request, response) {
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
                                //busca o trabalho
                                profile.findJob(request.params.id, function (error, job) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se trabalho foi encontrado
                                        if (job === null) {
                                            response.send({error : { message : 'job not found', name : 'NotFoundError', id : request.params.id, path : 'job'}});
                                        } else {
                                            //remove o trabalho
                                            job.remove();
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