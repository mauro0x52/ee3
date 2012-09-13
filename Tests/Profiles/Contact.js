/** Tests profiles.contact
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller contact do serviço profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /profile/[slug]/contact', function () {
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
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('profiles', '/profile/' + profile + '/contact', {}, function(error, data, response) {
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
        api.post('profiles', '/profile/inexistente/contact', {
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
        api.post('profiles', '/profile/' + profile + '/contact', {
                token     : 'tokeninvalido',
                address   : 'Number ' + rand(),
                type      : 'Twitter'
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

    it('address em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/contact', {
                token   : token,
                type      : 'Twitter'
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

    it('type em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/contact', {
                token   : token,
                address   : 'Number ' + rand()
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

    it('type inválido', function(done) {
        api.post('profiles', '/profile/' + profile + '/contact', {
                token   : token,
                address   : 'Number ' + rand(),
                type      : rand()
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

    it('cadastra contato', function(done) {
        var address = 'Number ' + rand(),
            type = 'Twitter';
        api.post('profiles', '/profile/' + profile + '/contact', {
                token   : token,
                address   : address,
                type      : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('contact').have.property('_id');
                    data.should.have.property('contact').have.property('address', address);
                    data.should.have.property('contact').have.property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /profile/[slug]/contactes', function () {
    var token,
        slug,
        version,
        profile,
        contactes = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('profiles', '/profile/' + profile + '/contact', {
                        token   : token,
                        address   : 'Number ' + rand(),
                        type      : 'Twitter'
                    }, function(error, data, response) {
                        contactes++;
                        if (contactes === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/contacts', {}, function(error, data, response) {
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
        api.get('profiles', '/profile/inexistente/contacts', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar contatos', function(done) {
        api.get('profiles', '/profile/' + profile + '/contacts', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                data.contacts.length.should.be.above(19);
                for (var i = 0 ; i < data.contacts.length; i = i + 1) {
                    data.contacts[i].should.have.property('_id');
                    data.contacts[i].should.have.property('address');
                    data.contacts[i].should.have.property('type');
                }
                done();
            }
        });
    });
});

describe('GET /profile/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        profile,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data.contact._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/contact/' + contact, {}, function(error, data, response) {
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
        api.get('profiles', '/profile/inexistente/contact/' + contact, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir contato', function(done) {
        api.get('profiles', '/profile/' + profile + '/contact/' + contact, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');    
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('address');
                data.should.have.property('contact').have.property('type');
                done();
            }
        });
    });
});

describe('DEL /profile/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        profile,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data.contact._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('profiles', '/profile/' + profile + '/contact/' + contact, {}, function(error, data, response) {
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
        api.del('profiles', '/profile/' + profile + '/contact/' + contact, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.del('profiles', '/profile/inexistente/contact/' + contact, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove contato', function(done) {
        api.del('profiles', '/profile/' + profile + '/contact/' + contact, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('profiles', '/profile/' + profile + '/contact/' + contact, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /profile/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        profile,
        contact,
        obj;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data.contact._id;
                    obj = data.contact;
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {}, function(error, data, response) {
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
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {
            token : 'invalido',
            address   : 'Number ' + rand(),
            type      : 'Twitter'
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
        api.put('profiles', '/profile/inexistente/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand(),
            type      : 'Twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('address em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {
            token : token,
            type      : 'Twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('address', obj.address);
                done();
            }
        });
    });
    
    it('type em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('type', obj.type);
                done();
            }
        });
    });
    
    it('type inválido', function(done) {
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand(),
            type      : rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('edita contato', function(done) {
        var address = 'Number ' + rand(),
            type = 'Twitter';
        api.put('profiles', '/profile/' + profile + '/contact/' + contact, {
            token : token,
            address   : address,
            type      : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                api.get('profiles', '/profile/' + profile + '/contact/' + contact, {token : token}, function (error, data) {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('contact').have.property('_id');
                    data.should.have.property('contact').have.property('address', address);
                    data.should.have.property('contact').have.property('type', type);
                    done();
                });
            }
        });
    });
});