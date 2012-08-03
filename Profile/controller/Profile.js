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
        
        //Verifica se existe o parametro Slug
        if (request.params.slug) {
            //Localiza o Profile
            Profile.findOne({"slugs.name" : request.params.slug}, function (error, profile) {
                if (error) {
                    response.send({error: error});
                } else {
                    response.send({Profile: profile});
                }
            });
        } else {
            response.send({error: "É necessário o envio de uma slug"});
        }
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
        var profile,
            jobs,
            slugs,
            validateSlugs,
            thumbnails,
            phones,
            contacts,
            links,
            parsJobs = [],
            parsSlugs = [],
            parsThumbnails = [],
            parsPhones = [],
            parsContacts = [],
            parsLinks = [];
        
        response.contentType('json');
        
        //Verifica se o usuário logado é válido
        auth(request.param('login'), request.param('token'), function (valid) {
            if (valid) {
                //Verifica se existe o parametro Jobs e trata os dados para adicionar no Model
                if (request.param('jobs', null)) {
                    jobs = request.param('jobs', null);
                    //Percorre entre os Jobs enviados
                    for(var job in jobs){
                        if (jobs.hasOwnProperty(job)) {
                            var temp = {};
                            //Percorre entre cada campo do job enviado
                            for(var jobField in jobs[job]){
                                if (jobs[job].hasOwnProperty(jobField)) {
                                    temp[jobField] = jobs[job][jobField];
                                }
                            }
                            parsJobs.push(temp);
                        }
                    }
                }
                //Verifica se existe o parametro Slugs e trata os dados para adicionar no Model
                if (request.param('slugs', null)) {
                    slugs = request.param('slugs', null);
                    //Percorre entre os Slugs enviados
                    for(var slug in slugs){
                        if (slugs.hasOwnProperty(slug)) {
                            var temp = {};
                            //Percorre entre cada campo do Slug enviado
                            for(var slugField in slugs[slug]){
                                if (slugs[slug].hasOwnProperty(slugField)) {
                                    temp[slugField] = slugs[slug][slugField];
                                }
                            }
                            parsSlugs.push(temp);
                        }
                    }
                }
                //Verifica se existe o parametro thumbnails e trata os dados para adicionar no Model
                if (request.param('thumbnails', null)) {
                    thumbnails = request.param('thumbnails', null);
                    //Percorre entre os Thumbnails enviados
                    for(var thumbnail in thumbnails){
                        if (thumbnails.hasOwnProperty(thumbnail)) {
                            var temp = {};
                            //Percorre entre cada campo do Thumbnail enviado
                            for(var thumbnailField in thumbnails[thumbnail]){
                                if (thumbnails[thumbnail].hasOwnProperty(thumbnailField)) {
                                    temp[thumbnailField] = thumbnails[thumbnail][thumbnailField];
                                }
                            }
                            parsThumbnails.push(temp);
                        }
                    }
                }
                //Verifica se existe o parametro phones e trata os dados para adicionar no Model
                if (request.param('phones', null)) {
                    phones = request.param('phones', null);
                    //Percorre entre os Phones enviados
                    for(var phone in phones){
                        if (phones.hasOwnProperty(phone)) {
                            var temp = {};
                            //Percorre entre cada campo do Phone enviado
                            for(var phoneField in phones[phone]){
                                if (phones[phone].hasOwnProperty(phoneField)) {
                                    temp[phoneField] = phones[phone][phoneField];
                                }
                            }
                            parsPhones.push(temp);
                        }
                    }
                }
                //Verifica se existe o parametro contacts e trata os dados para adicionar no Model
                if (request.param('contacts', null)) {
                    contacts = request.param('contacts', null);
                    //Percorre entre os Contacts enviados
                    for(var contact in contacts){
                        if (contacts.hasOwnProperty(contact)) {
                            var temp = {};
                            //Percorre entre cada campo do Contact enviado
                            for(var contactField in contacts[contact]){
                                if (contacts[contact].hasOwnProperty(contactField)) {
                                    temp[contactField] = contacts[contact][contactField];
                                }
                            }
                            parsContacts.push(temp);
                        }
                    }
                }
                //Verifica se existe o parametro links e trata os dados para adicionar no Model
                if (request.param('links', null)) {
                    links = request.param('links', null);
                    //Percorre entre os Links enviados
                    for(var link in links){
                        if (links.hasOwnProperty(link)) {
                            var temp = {};
                            //Percorre entre cada campo do Link enviado
                            for(var linkField in links[link]){
                                if (links[link].hasOwnProperty(linkField)) {
                                    temp[linkField] = links[link][linkField];
                                }
                            }
                            parsLinks.push(temp);
                        }
                    }
                }
                //Cria o Objeto Profile para adicionar no Model
                profile = new Profile({
                    users       : request.param('login', null),
                    jobs        : parsJobs,
                    slugs       : parsSlugs,
                    name        : request.param('name', null),
                    surname     : request.param('surname', null),
                    thumbnail   : parsThumbnails,
                    about       : request.param('about', null),
                    phones      : parsPhones,
                    contacts    : parsContacts,
                    links       : parsLinks,
                    dateCreated : new Date(),
                    dateUpdated : new Date()
                });
                //Salva o objeto no Model de Profile e retorna o objeto para o solicitante
                profile.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({profile : profile});
                    }
                });
            } else {
                request.send({error : error});
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
        var profile,
            slugs,
            parsSlugs = [];
        
        response.contentType('json');
        
        //Verifica se o usuário logado é válido
        auth(request.param('login'), request.param('token'), function (valid) {
            //Verifica se existe o parametro Slug
            if (request.params.slug) {
                //Localiza o Profile
                Profile.findOne({"slugs.name":request.params.slug}, function (error, profile) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        //Verifica se o Profile foi encontrado
                        if (profile) {
                            //Verifica se existe o parametro Slugs e trata os dados para adicionar no Model
                            if (request.param('slugs', null)) {
                                slugs = request.param('slugs', null);
                                //Percorre entre os Slugs enviados
                                for(var slug in slugs){
                                    if (slugs.hasOwnProperty(slug)) {
                                        var temp = {};
                                        //Percorre entre cada campo do Slug enviado
                                        for(var slugField in slugs[slug]){
                                            if (slugs[slug].hasOwnProperty(slugField)) {
                                                temp[slugField] = slugs[slug][slugField];
                                            }
                                        }
                                        //adiciona a variável parsSlugs os campos encontrados
                                        parsSlugs.push(temp);
                                    }
                                }
                            }
                            //Alterando o Profile
                            this.name = request.param('name', null);
                            this.surname = request.param('surname', null);
                            this.about = request.param('about', null);
                            this.dateUpdated = new Date();
                            this.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({Profile : profile});
                                }
                            });
                        } else {
                            response.send({error: "Profile não encontrado."});
                        }
                    }
                });
            } else {
                response.send({error: "É necessário o envio de uma slug"});
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
                            response.send({error : 'Profile não encontrado'});
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