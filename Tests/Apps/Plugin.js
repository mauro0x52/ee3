/** Tests Apps.Plugin
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Plugin do serviço Apps
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /app/[slug]/version/[number]/plugin', function () {
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
            token = data.token;
            api.post('apps', '/app', {
                token : token,
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.number;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('aplicativo inexistente', function(done) {
        api.post('apps', '/app/inexistente/version/' + version + '/plugin', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('versão inexistente', function(done) {
        api.post('apps', '/app/' + slug + '/version/inexistente/plugin', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin', {
                token   : 'tokeninvalido',
                slug  : 'slug-' + rand(),
                name    : 'Plugin ' + rand(),
                source  : 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('nome em branco', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin', {
                token   : token,
                slug  : 'slug-' + rand(),
                source  : 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('código em branco', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin', {
                token   : token,
                slug  : 'slug-' + rand(),
                name    : 'Plugin ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('cadastrar plugin', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin', {
                token  : token,
                name    : 'Plugin ' + rand(),
                slug  : 'slug-' + rand(),
                source  : 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('_id');
                    data.should.have.property('name');
                    data.should.have.property('source');
                    done();
                }
            }
        );
    });
});

describe('GET /app/[slug]/version/[number]/plugins', function () {
    var token,
        slug,
        version,
        plugins = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('apps', '/app', {
                token : token,
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.number;
                    for (var i = 0; i < 20; i = i + 1) {
                        api.post('apps', '/app/' + slug + '/version/' + version + '/plugin',  {
                            token : token,
                            name  : 'Plugin ' + rand(),
                            source: 'Código ' + rand(),
                            slug  : 'slug-' + rand()
                        }, function (error, data) {
                            plugins++;
                            if (plugins === 20) {
                                done();
                            }
                        });
                    }
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/plugins', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('aplicativo inexistente', function(done) {
        api.get('apps', '/app/inexistente/version/' + version + '/plugins', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/plugins', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('lista de pelo menos 20 plugins', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/plugins', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('name');
                    data[i].should.have.property('source');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]/version/[number]/plugin/[id]', function () {
    var token,
        slug,
        version,
        plugin;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('apps', '/app', {
                token : token,
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/plugin',  {
                        token : token,
                        name  : 'Plugin ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        plugin = data.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('aplicativo inexistente', function(done) {
        api.get('apps', '/app/inexistente/version/' + version + '/plugin/' + plugin, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/plugin/' + plugin, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('plugin inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/plugin/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('plugin existente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('_id');
                data.should.have.property('name');
                data.should.have.property('source');
                done();
            }
        });
    });
});

describe('DEL /app/[slug]/version/[number]/plugin/[id]', function () {
    var token,
        slug,
        version,
        plugin;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('apps', '/app', {
                token : token,
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/plugin',  {
                        token : token,
                        name  : 'Plugin ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        plugin = data.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {}, function(error, data, response) {
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
        api.del('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente/version/' + version + '/plugin/' + plugin, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/inexistente/plugin/' + plugin, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('plugin inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/plugin/inexistente', {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('remover plugin', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /app/[slug]/version/[number]/plugin/[id]', function () {
    var token,
        slug,
        version,
        plugin,
        name;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('apps', '/app', {
                token : token,
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/plugin',  {
                        token : token,
                        name  : 'Plugin ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        plugin = data.slug;
                        name = data.name;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {}, function(error, data, response) {
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
        api.put('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {
            token : 'invalido',
            name  : 'Plugin ' + rand(),
            source: 'Código ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.put('apps', '/app/inexistente/version/' + version + '/plugin/' + plugin, {
                token : token,
                name  : 'Plugin ' + rand(),
                source: 'Código ' + rand()
            }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.put('apps', '/app/' + slug + '/version/inexistente/plugin/' + plugin,{
                token : token,
                name  : 'Plugin ' + rand(),
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('plugin inexistente', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/plugin/inexistente', {
                token : token,
                name  : 'Plugin ' + rand(),
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
                    done();
                }
            }
        );
    });

    it('nome em branco', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {
                token : token,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('_id');
                    data.should.have.property('name', name);
                    data.should.have.property('source');
                    done();
                }
            }
        );
    });

    it('editar plugin', function(done) {
        var new_name = 'Plugin ' + rand();
        api.put('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {
                token : token,
                name  : new_name,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error);
                    api.get('apps', '/app/' + slug + '/version/' + version + '/plugin/' + plugin, {token : token}, function (error, data) {
                        should.not.exist(data.error, 'algo deu errado');
                        data.should.have.property('_id');
                        data.should.have.property('name', new_name);
                        data.should.have.property('source');
                        done();
                    });
                }
            }
        );
    });
});