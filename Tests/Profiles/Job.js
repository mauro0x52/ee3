/** Tests profiles.job
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller job do serviço profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /profile/[slug]/job', function () {
    var token,
        slug,
        version,
        profile;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('profiles', '/profile/' + profile + '/job', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('perfil inexistente', function(done) {
        api.post('profiles', '/profile/inexistente/job', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('profiles', '/profile/' + profile + '/job', {
                token     : 'tokeninvalido',
                name        : 'Nome ' + rand(),
                companyName : 'Teste ' + rand(),
                description : 'About ' + rand(),
                dateStart   : new Date(),
                dateEnd     : new Date()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('name em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/job', {
                token   : token,
                companyName : 'Teste ' + rand(),
                description : 'About ' + rand(),
                dateStart   : new Date(),
                dateEnd     : new Date()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('cadastra job', function(done) {
        api.post('profiles', '/profile/' + profile + '/job', {
                token   : token,
                name        : 'Nome ' + rand(),
                companyName : 'Teste ' + rand(),
                description : 'About ' + rand(),
                dateStart   : new Date(),
                dateEnd     : new Date()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('_id');
                    data.should.have.property('name');
                    data.should.have.property('companyName');
                    data.should.have.property('description');
                    data.should.have.property('dateStart');
                    data.should.have.property('dateEnd');
                    done();
                }
            }
        );
    });
});

describe('GET /profile/[slug]/jobes', function () {
    var token,
        slug,
        version,
        profile,
        jobes = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('profiles', '/profile/' + profile + '/job', {
                        token   : token,
                        name        : 'Nome ' + rand(),
                        companyName : 'Teste ' + rand(),
                        description : 'About ' + rand(),
                        dateStart   : new Date(),
                        dateEnd     : new Date()
                    }, function(error, data, response) {
                        jobes++;
                        if (jobes === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/jobs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/jobs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar jobs', function(done) {
        api.get('profiles', '/profile/' + profile + '/jobs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('name');
                    data[i].should.have.property('companyName');
                    data[i].should.have.property('description');
                    data[i].should.have.property('dateStart');
                    data[i].should.have.property('dateEnd');
                }
                done();
            }
        });
    });
});

describe('GET /profile/[slug]/job/[id]', function () {
    var token,
        slug,
        version,
        profile,
        job;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.slug;
                api.post('profiles', '/profile/' + profile + '/job', {
                    token   : token,
                    name        : 'Nome ' + rand(),
                    companyName : 'Teste ' + rand(),
                    description : 'About ' + rand(),
                    dateStart   : new Date(),
                    dateEnd     : new Date()
                }, function(error, data, response) {
                    job = data._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/job/' + job, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/job/' + job, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir contato', function(done) {
        api.get('profiles', '/profile/' + profile + '/job/' + job, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');    
                data.should.have.property('_id');
                data.should.have.property('name');
                data.should.have.property('companyName');
                data.should.have.property('description');
                data.should.have.property('dateStart');
                data.should.have.property('dateEnd');
                done();
            }
        });
    });
});

describe('DEL /profile/[slug]/job/[id]', function () {
    var token,
        slug,
        version,
        profile,
        job;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.slug;
                api.post('profiles', '/profile/' + profile + '/job', {
                    token   : token,
                    name        : 'Nome ' + rand(),
                    companyName : 'Teste ' + rand(),
                    description : 'About ' + rand(),
                    dateStart   : new Date(),
                    dateEnd     : new Date()
                }, function(error, data, response) {
                    job = data._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('profiles', '/profile/' + profile + '/job/' + job, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('token inválido', function(done) {
        api.del('profiles', '/profile/' + profile + '/job/' + job, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.del('profiles', '/profile/inexistente/job/' + job, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove job', function(done) {
        api.del('profiles', '/profile/' + profile + '/job/' + job, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('profiles', '/profile/' + profile + '/job/' + job, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /profile/[slug]/job/[id]', function () {
    var token,
        slug,
        version,
        profile,
        job,
        obj;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.slug;
                api.post('profiles', '/profile/' + profile + '/job', {
                    token   : token,
                    name        : 'Nome ' + rand(),
                    companyName : 'Teste ' + rand(),
                    description : 'About ' + rand(),
                    dateStart   : new Date(),
                    dateEnd     : new Date()
                }, function(error, data, response) {
                    job = data._id;
                    obj = data;
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('profiles', '/profile/' + profile + '/job/' + job, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('token inválido', function(done) {
        api.put('profiles', '/profile/' + profile + '/job/' + job, {
            token : 'invalido',
            name        : 'Nome ' + rand(),
            companyName : 'Teste ' + rand(),
            description : 'About ' + rand(),
            dateStart   : new Date(),
            dateEnd     : new Date()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.put('profiles', '/profile/inexistente/job/' + job, {
            token : token,
            name        : 'Nome ' + rand(),
            companyName : 'Teste ' + rand(),
            description : 'About ' + rand(),
            dateStart   : new Date(),
            dateEnd     : new Date()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('name em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/job/' + job, {
            token : token,
            companyName : 'Teste ' + rand(),
            description : 'About ' + rand(),
            dateStart   : new Date(),
            dateEnd     : new Date()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('_id');
                data.should.have.property('name', obj.name);
                done();
            }
        });
    });
    
    it('edita contato', function(done) {
        var name        = 'Nome ' + rand(),
            companyName = 'Teste ' + rand(),
            description = 'About ' + rand();
        api.put('profiles', '/profile/' + profile + '/job/' + job, {
            token : token,
            name        : name,
            companyName : companyName,
            description : description,
            dateStart   : new Date(),
            dateEnd     : new Date()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                api.get('profiles', '/profile/' + profile + '/job/' + job, {token : token}, function (error, data) {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('_id');
                    data.should.have.property('name', name);
                    data.should.have.property('companyName', companyName);
                    data.should.have.property('description', description);
                    done();
                });
            }
        });
    });
});