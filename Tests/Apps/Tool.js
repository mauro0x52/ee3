/** Tests Apps.Tool
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Tool do serviço Apps
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /app/[slug]/version/[number]/tool', function () {
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
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.version.number;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/tool', {}, function(error, data, response) {
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
        api.post('apps', '/app/inexistente/version/' + version + '/tool', {
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

    it('versão inexistente', function(done) {
        api.post('apps', '/app/' + slug + '/version/inexistente/tool', {
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/tool', {
                token   : 'tokeninvalido',
                slug  : 'slug-' + rand(),
                name    : 'Tool ' + rand(),
                source  : 'Código ' + rand()
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

    it('nome em branco', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/tool', {
                token   : token,
                slug  : 'slug-' + rand(),
                source  : 'Código ' + rand()
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

    it('código em branco', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/tool', {
                token   : token,
                slug  : 'slug-' + rand(),
                name    : 'Tool ' + rand()
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

    it('cadastrar tool', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/tool', {
                token  : token,
                name    : 'Tool ' + rand(),
                slug  : 'slug-' + rand(),
                source  : 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('tool').have.property('_id');
                    data.should.have.property('tool').have.property('name');
                    data.should.have.property('tool').have.property('source');
                    done();
                }
            }
        );
    });
});

describe('GET /app/[slug]/version/[number]/tools', function () {
    var token,
        slug,
        version,
        tools = 0;

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
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.version.number;
                    for (var i = 0; i < 20; i = i + 1) {
                        api.post('apps', '/app/' + slug + '/version/' + version + '/tool',  {
                            token : token,
                            name  : 'Tool ' + rand(),
                            source: 'Código ' + rand(),
                            slug  : 'slug-' + rand()
                        }, function (error, data) {
                            tools++;
                            if (tools === 20) {
                                done();
                            }
                        });
                    }
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/tools', {}, function(error, data, response) {
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
        api.get('apps', '/app/inexistente/version/' + version + '/tools', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/tools', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('lista de pelo menos 20 tools', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/tools', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');           
                data.should.have.property('tools');
                for (var i = 0 ; i < data.tools.length; i = i + 1) {
                    data.tools[i].should.have.property('_id');
                    data.tools[i].should.have.property('name');
                    data.tools[i].should.have.property('source');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]/version/[number]/tool/[id]', function () {
    var token,
        slug,
        version,
        tool;

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
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.version.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/tool',  {
                        token : token,
                        name  : 'Tool ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        tool = data.tool.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {}, function(error, data, response) {
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
        api.get('apps', '/app/inexistente/version/' + version + '/tool/' + tool, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/tool/' + tool, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('tool inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/tool/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('tool existente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('tool');
                done();
            }
        });
    });
});

describe('DEL /app/[slug]/version/[number]/tool/[id]', function () {
    var token,
        slug,
        version,
        tool;

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
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.version.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/tool',  {
                        token : token,
                        name  : 'Tool ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        tool = data.tool.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {}, function(error, data, response) {
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
        api.del('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente/version/' + version + '/tool/' + tool, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/inexistente/tool/' + tool, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('tool inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/tool/inexistente', {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('tool existente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /app/[slug]/version/[number]/tool/[id]', function () {
    var token,
        slug,
        version,
        tool,
        name;

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
                name  : "Aplicativo " + rand(),
                type  : 'free'
            }, function (error, data) {
                slug = data.app.slug;
                api.post('apps', '/app/' + slug + '/version', {
                    token  : token,
                    number : rand()
                }, function (error, data) {
                    version = data.version.number;
                    api.post('apps', '/app/' + slug + '/version/' + version + '/tool',  {
                        token : token,
                        name  : 'Tool ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        tool = data.tool.slug;
                        name = data.tool.name;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {}, function(error, data, response) {
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
        api.put('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {
            token : 'invalido',
            name  : 'Tool ' + rand(),
            source: 'Código ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.put('apps', '/app/inexistente/version/' + version + '/tool/' + tool, {
                token : token,
                name  : 'Tool ' + rand(),
                source: 'Código ' + rand()
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
        api.put('apps', '/app/' + slug + '/version/inexistente/tool/' + tool,{
                token : token,
                name  : 'Tool ' + rand(),
                source: 'Código ' + rand()
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

    it('tool inexistente', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/tool/inexistente', {
                token : token,
                name  : 'Tool ' + rand(),
                source: 'Código ' + rand()
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

    it('nome em branco', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {
                token : token,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('tool').have.property('name');
                    data.should.have.property('tool').have.property('source');
                    done();
                }
            }
        );
    });

    it('tool existente', function(done) {
        var new_name = 'Tool ' + rand();
        api.put('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {
                token : token,
                name  : new_name,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.not.have.property('error');
                    api.get('apps', '/app/' + slug + '/version/' + version + '/tool/' + tool, {token : token}, function (error, data) {
                        should.not.exist(data.error, 'algo deu errado');
                        data.should.have.property('tool').have.property('name', new_name);
                        data.should.have.property('tool').have.property('source');
                        done();
                    });
                }
            }
        );
    });
});