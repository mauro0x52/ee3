/** Tests Companies.contact
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller contact do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /company/[slug]/contact', function () {
    var token,
        slug,
        version,
        company;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('companies', '/company/' + company + '/contact', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.post('companies', '/company/inexistente/contact', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('companies', '/company/' + company + '/contact', {
                token     : 'tokeninvalido',
                address   : 'Number ' + rand(),
                type      : 'Twitter'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });

    it('address em branco', function(done) {
        api.post('companies', '/company/' + company + '/contact', {
                token   : token,
                type      : 'twitter'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').property('name', 'ValidationError');
                    done();
                }
            }
        );
    });

    it('type em branco', function(done) {
        api.post('companies', '/company/' + company + '/contact', {
                token   : token,
                address   : 'Number ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').property('name', 'ValidationError');
                    done();
                }
            }
        );
    });

    it('type inválido', function(done) {
        api.post('companies', '/company/' + company + '/contact', {
                token   : token,
                address   : 'Number ' + rand(),
                type      : rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').property('name', 'ValidationError');
                    done();
                }
            }
        );
    });

    it('cadastra contato', function(done) {
        var address = 'Number ' + rand(),
            type = 'twitter';
        api.post('companies', '/company/' + company + '/contact', {
                token   : token,
                address   : address,
                type      : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data);
                    data.should.not.have.property('error');
                    data.should.have.property('contact').have.property('_id');
                    data.should.have.property('contact').have.property('address', address);
                    data.should.have.property('contact').have.property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /company/[slug]/contactes', function () {
    var token,
        slug,
        version,
        company,
        contactes = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('companies', '/company/' + company + '/contact', {
                        token   : token,
                        address   : 'Number ' + rand(),
                        type      : 'twitter'
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
        api.get('companies', '/company/' + company + '/contacts', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.get('companies', '/company/inexistente/contacts', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('listar contatos', function(done) {
        api.get('companies', '/company/' + company + '/contacts', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data.contact[i].should.have.property('_id');
                    data.contact[i].should.have.property('address');
                    data.contact[i].should.have.property('type');
                }
                done();
            }
        });
    });
});

describe('GET /company/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        company,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'twitter'
                }, function(error, data, response) {
                    contact = data.contact._id
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/contact/' + contact, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.get('companies', '/company/inexistente/contact/' + contact, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibir contato', function(done) {
        api.get('companies', '/company/' + company + '/contact/' + contact, {}, function(error, data, response) {
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

describe('DEL /company/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        company,
        contact;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'twitter'
                }, function(error, data, response) {
                    contact = data.contact._id
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('companies', '/company/' + company + '/contact/' + contact, {}, function(error, data, response) {
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
        api.del('companies', '/company/' + company + '/contact/' + contact, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/contact/' + contact, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('remove contato', function(done) {
        api.del('companies', '/company/' + company + '/contact/' + contact, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('companies', '/company/' + company + '/contact/' + contact, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /company/[slug]/contact/[id]', function () {
    var token,
        slug,
        version,
        company,
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
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'twitter'
                }, function(error, data, response) {
                    contact = data.contact._id;
                    obj = data.contact;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('companies', '/company/' + company + '/contact/' + contact, {}, function(error, data, response) {
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
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : 'invalido',
            address   : 'Number ' + rand(),
            type      : 'twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.put('companies', '/company/inexistente/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand(),
            type      : 'twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('address em branco', function(done) {
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            type      : 'twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.contact;
                data.should.not.have.property('error');
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('address', obj.address);
                done();
            }
        });
    });

    it('type em branco', function(done) {
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.contact;
                data.should.not.have.property('error');
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('type', obj.type);
                done();
            }
        });
    });

    it('type inválido', function(done) {
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            address   : 'Number ' + rand(),
            type      : rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'ValidationError');
                done();
            }
        });
    });

    it('edita contato', function(done) {
        var address = 'Number ' + rand(),
            type = 'twitter';
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            address   : address,
            type      : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('contact').have.property('_id');
                data.should.have.property('contact').have.property('address', address);
                data.should.have.property('contact').have.property('type', type);
                done();
            }
        });
    });
});