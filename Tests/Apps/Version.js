/** Tests Apps.Version
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Version do serviço Apps
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /app/[slug]/version', function () {
    var token,
        slug;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('apps', '/app', {
                token : token,
                name  : 'Aplicativo ' + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('apps', '/app/' + slug + '/version', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.post('apps', '/app/inexistente/version', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('apps', '/app/' + slug + '/version', {
                token   : 'tokeninvalido',
                number    : rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                    done();
                }
            }
        );
    });

    it('versão em branco', function(done) {
        api.post('apps', '/app/' + slug + '/version', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.have.property('error').have.property('name', 'ValidationError');
                    done();
                }
            }
        );
    });

    it('cadastrar versão', function(done) {
        api.post('apps', '/app/' + slug + '/version', {
                token  : token,
                number : rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('version').have.property('number');
                    done();
                }
            }
        );
    });
});

describe('GET /app/[slug]/versions', function () {
    var token,
        slug,
        versions = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('apps', '/app', {
                token : token,
                name  : 'Aplicativo ' + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('apps', '/app/' + slug + '/version', {
                        token   : token,
                        number  : rand()
                    }, function (error, data) {
                        versions++;
                        if (versions === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/versions', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.get('apps', '/app/inexistente/versions', {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                    data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('lista de pelo menos 20 versões', function(done) {
        api.get('apps', '/app/' + slug + '/versions', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('versions');
                data.versions.length.should.be.above(19);
                for (var i = 0 ; i < data.versions.length; i = i + 1) {
                    data.versions[i].should.have.property('_id');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]/version/[slug]', function () {
    var token,
        slug,
        version;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('apps', '/app', {
                token : token,
                name  : 'Aplicativo ' + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token   : token,
                    number  : rand()
                }, function (error, data) {
                    version = data.version.number;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.get('apps', '/app/inexistente/version/' + version, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão existente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('version');
                done();
            }
        });
    });
});

describe('DEL /app/[slug]/version/[number]', function () {
    var token,
        slug,
        version;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('apps', '/app', {
                token : token,
                name  : 'Aplicativo ' + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token   : token,
                    number  : rand()
                }, function (error, data) {
                    version = data.version.number;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente/version/' + version, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/inexistente', {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('excluir versão', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('apps', '/app/' + slug + '/version/' + version, {token : token}, function (error, data) {
                    should.exist(data, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /app/[slug]/version/[numer]', function () {
    var token,
        slug,
        version;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('apps', '/app', {
                token : token,
                name  : 'Aplicativo ' + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token   : token,
                    number  : rand()
                }, function (error, data) {
                    version = data.version.number;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version, {
                token : 'invalido',
                number  : rand()
            }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                    data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('numero em branco', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version, {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('version').have.property('number', version);
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.put('apps', '/app/inexistente/version/' + version, {
            token : token,
            number  : rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.put('apps', '/app/' + slug + '/version/inexistente', {
            token : token,
            number  : rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão existente', function(done) {
        var new_version = rand();

        api.put('apps', '/app/' + slug + '/version/' + version, {
            token : token,
            number  : new_version
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('version').have.property('number', new_version);
                done();
            }
        });
    });
});