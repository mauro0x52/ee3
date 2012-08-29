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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
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
                    should.exist(data.error);
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
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('address em branco', function(done) {
        api.post('companies', '/company/' + company + '/contact', {
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
        api.post('companies', '/company/' + company + '/contact', {
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
        api.post('companies', '/company/' + company + '/contact', {
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
        api.post('companies', '/company/' + company + '/contact', {
                token   : token,
                address   : address,
                type      : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('_id');
                    data.should.have.property('address', address);
                    data.should.have.property('type', type);
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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('companies', '/company/' + company + '/contact', {
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
                should.exist(data.error);
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
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('address');
                    data[i].should.have.property('type');
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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data._id
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
                should.exist(data.error);
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
                data.should.have.property('_id');
                data.should.have.property('address');
                data.should.have.property('type');
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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data._id
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
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/contact/' + contact, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/contact', {
                    token   : token,
                    address   : 'Number ' + rand(),
                    type      : 'Twitter'
                }, function(error, data, response) {
                    contact = data._id;
                    obj = data;
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
    
    it('empresa inexistente', function(done) {
        api.put('companies', '/company/inexistente/contact/' + contact, {
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
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            type      : 'Twitter'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('_id');
                data.should.have.property('address', obj.address);
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
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('_id');
                data.should.have.property('type', obj.type);
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
                should.exist(data.error);
                done();
            }
        });
    });

    it('edita contato', function(done) {
        var address = 'Number ' + rand(),
            type = 'Twitter';
        api.put('companies', '/company/' + company + '/contact/' + contact, {
            token : token,
            address   : address,
            type      : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                data.should.have.property('_id');
                data.should.have.property('address', address);
                data.should.have.property('type', type);
                done();
            }
        });
    });
});