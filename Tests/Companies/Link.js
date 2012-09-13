/** Tests Companies.link
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller link do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /company/[slug]/link', function () {
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
        api.post('companies', '/company/' + company + '/link', {}, function(error, data, response) {
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
        api.post('companies', '/company/inexistente/link', {
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
        api.post('companies', '/company/' + company + '/link', {
                token     : 'tokeninvalido',
                url     : 'Url ' + rand(),
                type    : 'Youtube'
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

    it('url em branco', function(done) {
        api.post('companies', '/company/' + company + '/link', {
                token   : token,
                type    : 'Youtube'
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
        api.post('companies', '/company/' + company + '/link', {
                token   : token,
                url     : 'Url ' + rand()
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
        api.post('companies', '/company/' + company + '/link', {
                token   : token,
                url     : 'Url ' + rand(),
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

    it('cadastra link', function(done) {
        var url = 'Url ' + rand(),
            type = 'Youtube';
        api.post('companies', '/company/' + company + '/link', {
                token   : token,
                url     : url,
                type    : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error);
                    data.should.have.property('link').have.property('_id');
                    data.should.have.property('link').have.property('url', url);
                    data.should.have.property('link').have.property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /company/[slug]/linkes', function () {
    var token,
        slug,
        version,
        company,
        linkes = 0;

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
                    api.post('companies', '/company/' + company + '/link', {
                        token   : token,
                        url     : 'Url ' + rand(),
                        type    : 'Youtube'
                    }, function(error, data, response) {
                        linkes++;
                        if (linkes === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/links', {}, function(error, data, response) {
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
        api.get('companies', '/company/inexistente/links', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar links', function(done) {
        api.get('companies', '/company/' + company + '/links', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                for (var i = 0 ; i < data.links.length; i = i + 1) {
                    data.links[i].should.have.property('_id');
                    data.links[i].should.have.property('url');
                    data.links[i].should.have.property('type');
                }
                done();
            }
        });
    });
});

describe('GET /company/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        company,
        link;

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
                api.post('companies', '/company/' + company + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'Youtube'
                }, function(error, data, response) {
                    link = data.link._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/link/' + link, {}, function(error, data, response) {
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
        api.get('companies', '/company/inexistente/link/' + link, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir link', function(done) {
        api.get('companies', '/company/' + company + '/link/' + link, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');    
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('url');
                data.should.have.property('link').have.property('type');
                done();
            }
        });
    });
});

describe('DEL /company/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        company,
        link;

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
                api.post('companies', '/company/' + company + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'Youtube'
                }, function(error, data, response) {
                    link = data.link._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('companies', '/company/' + company + '/link/' + link, {}, function(error, data, response) {
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
        api.del('companies', '/company/' + company + '/link/' + link, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/link/' + link, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove link', function(done) {
        api.del('companies', '/company/' + company + '/link/' + link, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('companies', '/company/' + company + '/link/' + link, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /company/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        company,
        link,
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
                api.post('companies', '/company/' + company + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'Youtube'
                }, function(error, data, response) {
                    link = data.link._id;
                    obj=data.link;
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('companies', '/company/' + company + '/link/' + link, {}, function(error, data, response) {
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
        api.put('companies', '/company/' + company + '/link/' + link, {
            token : 'invalido',
            url     : 'Url ' + rand(),
            type    : 'Youtube'
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
        api.put('companies', '/company/inexistente/link/' + link, {
            token : token,
            url     : 'Url ' + rand(),
            type    : 'Youtube'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('url em branco', function(done) {
        api.put('companies', '/company/' + company + '/link/' + link, {
            token : token,
            type    : 'Youtube'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj=data.link;
                should.not.exist(data.error);
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('url', obj.url);
                done();
            }
        });
    });
    
    it('type em branco', function(done) {
        api.put('companies', '/company/' + company + '/link/' + link, {
            token : token,
            url     : 'Url ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj=data.link;
                should.not.exist(data.error);
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('type', obj.type);
                done();
            }
        });
    });
    
    it('edita link', function(done) {
        var url  = 'Url ' + rand(),
            type = 'Youtube';
        api.put('companies', '/company/' + company + '/link/' + link, {
            token : token,
            url     : url,
            type    : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('url', url);
                data.should.have.property('link').have.property('type', type);
                done();
            }
        });
    });
});