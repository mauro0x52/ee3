/** Tests Apps.App
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller App do serviço Apps
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /app', function () {
    var token;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            done();
        });
    });

    it('url tem que existir', function(done) {
        api.post('apps', '/app', {}, function(error, data, response) {
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
        api.post('apps', '/app', {
                token   : 'tokeninvalido',
                name    : 'testando serviço de apps',
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('slug');
                    data.should.not.have.property('name');
                    data.should.not.have.property('type');
                    data.should.not.have.property('creator');
                    done();
                }
            }
        );
    });

    it('nome em branco', function(done) {
        api.post('apps', '/app', {
                token : token,
                slug    : 'testando-app',
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('slug');
                    data.should.not.have.property('name');
                    data.should.not.have.property('type');
                    data.should.not.have.property('creator');
                    done();
                }
            }
        );
    });

    it('tipo inválido', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : "Aplicativo " + rand(),
                type    : 'ola'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('slug');
                    data.should.not.have.property('name');
                    data.should.not.have.property('type');
                    data.should.not.have.property('creator');
                    done();
                }
            }
        );
    });

    it('cadastrar app gratuito', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : "Aplicativo " + rand(),
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('_id');
                    data.should.have.property('slug');
                    data.should.have.property('name');
                    data.should.have.property('type');
                    data.should.have.property('creator');
                    done();
                }
            }
        );
    });

    it('cadastrar app pago', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : "Aplicativo " + rand(),
                type    : 'payed'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('_id');
                    data.should.have.property('slug');
                    data.should.have.property('name');
                    data.should.have.property('type');
                    data.should.have.property('creator');
                    done();
                }
            }
        );
    });

    it('cadastrar app compulsório', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : "Aplicativo " + rand(),
                type    : 'compulsory'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('_id');
                    data.should.have.property('slug');
                    data.should.have.property('name');
                    data.should.have.property('type');
                    data.should.have.property('creator');
                    done();
                }
            }
        );
    });
});

describe('GET /apps', function () {
    var token;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            var apps = 0;
            token = data.token;
            //cria 20 aplicativos
            for (var i = 0; i < 20; i = i + 1) {
                api.post('apps', '/app', {
                    token : data.token,
                    name  : 'Aplicativo ' + rand(),
                    type  : 'compulsory'
                }, function(error, data, response) {
                    apps++;
                    if (apps === 20) {
                        done();
                    }
                });
            }
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/apps', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('lista de pelo menos 20 aplicativos', function(done) {
        api.get('apps', '/apps', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('slug');
                    data[i].should.have.property('name');
                    data[i].should.have.property('type');
                    data[i].should.have.property('creator');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]', function () {
    var token,
        slug;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            //cria um aplicativo
            api.post('apps', '/app', {
                token : token,
                name    : 'Aplicativo ' + rand(),
                type    : 'payed'
            }, function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    slug = data.slug;
                    done();
                }
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug, {}, function(error, data, response) {
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
        api.get('apps', '/app/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('app existente', function(done) {
        api.get('apps', '/app/' + slug, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('_id');
                data.should.have.property('slug');
                data.should.have.property('name');
                data.should.have.property('type');
                data.should.have.property('creator');
                done();
            }
        });
    });
});

describe('DEL /app/[slug]', function () {
    var token,
        slug;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            //cria um aplicativo
            api.post('apps', '/app', {
                token : token,
                name    : 'Aplicativo ' + rand(),
                type    : 'payed'
            }, function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    slug = data.slug;
                    done();
                }
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('apps', '/app/' + slug, {}, function(error, data, response) {
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
        api.del('apps', '/app/' + slug, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else { 
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('app existente', function(done) {
        api.del('apps', '/app/' + slug, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('apps', '/app/' + slug, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /app/[slug]', function () {
    var token,
        slug;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            //cria um aplicativo
            api.post('apps', '/app', {
                token : token,
                name    : 'Aplicativo ' + rand(),
                type    : 'payed'
            }, function(error, data, response) {
                if (error) {
                    done(error);
                } else {
                    slug = data.slug;
                    done();
                }
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('apps', '/app/' + slug, {}, function(error, data, response) {
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
        api.put('apps', '/app/' + slug, {
                token : 'invalido',
                name    : 'Aplicativo ' + rand(),
                type    : 'free'
            }, function(error, data, response) {
            if (error) {
                return done(error);
            } else { 
                should.exist(data.error);
                should.not.exist(data.slug);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('nome em branco', function(done) {
        api.put('apps', '/app/' + slug, {
            token : token,
            type    : 'free'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('tipo inválido', function(done) {
        var name = 'Aplicativo ' + rand();

        api.put('apps', '/app/' + slug, {
            token : token,
            name    : name,
            type    : 'ola'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.put('apps', '/app/inexistente', {
            token : token,
            name    : 'Aplicativo ' + rand(),
            type    : 'payed'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('slug');
                data.should.not.have.property('name');
                data.should.not.have.property('type');
                data.should.not.have.property('creator');
                done();
            }
        });
    });

    it('app existente', function(done) {
        var name = 'Aplicativo ' + rand();

        api.put('apps', '/app/' + slug, {
            token : token,
            name    : name,
            type    : 'free'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                should.exist(data);
                data.should.have.property('_id');
                data.should.have.property('slug');
                data.should.have.property('name', name);
                data.should.have.property('type', 'free');
                data.should.have.property('creator');
                done();
            }
        });
    });
});