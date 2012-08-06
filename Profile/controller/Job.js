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
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //busca o perfil
                Profile.find({slug : request.params.slug}, function (error, profile) {
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
                                profile.jobs.push({
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
        Profile.find({slug : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrada
                if (profile === null) {
                    response.send({error : 'profile not found'});
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
    app.get('/company/:slug/job/:id', function (request, response) {
        response.contentType('json');

        //busca o perfil
        Profile.find({slug : request.params.slug}, function (error, profile) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o perfil foi encontrado
                if (profile === null) {
                    response.send({error : 'profile not found'});
                } else {
                    //busca trabalho
                    profile.findJob(request.params.id, function (error, job) {
                        if (error) {
                            response.send({error : error});
                        } else {
                            //verifica se trabalho foi encontrado
                            if ( === null) {
                                response.send({error : 'job not found'});
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
    app.put('/company/:slug/job/:id', function (request, response) {
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
                                //busca o trabalho
                                profile.findJob(request.params.id, function (error, job) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se o trabalho foi encontrado
                                        if (job === null) {
                                            response.send({error : 'job not found'});
                                        } else {
                                            //altera os dados do trabalho
                                            job.company = request.param('company', null);
                                            job.companyName = request.param('companyName', null);
                                            job.description = request.param('description', null);
                                            job.dateStart = request.param('dateStart', null);
                                            job.dateEnd = request.param('dateEnd', null);
                                            //salva as alterações
                                            job.save(function (error) {
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
    app.del('/company/:slug/job/:id', function (request, response) {
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
                                //busca o trabalho
                                profile.findJob(request.params.id, function (error, job) {
                                    if (error) {
                                        response.send({error : error});
                                    } else {
                                        //verifica se trabalho foi encontrado
                                        if (job === null) {
                                            response.send({error : 'job not found'});
                                        } else {
                                            //remove o trabalho
                                            job.remove(function (error) {
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