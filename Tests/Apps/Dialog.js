/** Tests Apps.Dialog
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Dialog do serviço Apps
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /app/[slug]/version/[number]/dialog', function () {
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {}, function(error, data, response) {
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
        api.post('apps', '/app/inexistente/version/' + version + '/dialog', {
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
        api.post('apps', '/app/' + slug + '/version/inexistente/dialog', {
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : 'tokeninvalido',
                name    : 'Dialog ' + rand(),
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : token,
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : token,
                name    : 'Dialog ' + rand()
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

    it('cadastrar dialog', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token  : token,
                name    : 'Dialog ' + rand(),
                slug  : 'slug-' + rand(),
                source  : 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('dialog').have.property('_id');
                    data.should.have.property('dialog').have.property('name');
                    data.should.have.property('dialog').have.property('source');
                    done();
                }
            }
        );
    });
});

describe('GET /app/[slug]/version/[number]/dialogs', function () {
    var token,
        slug,
        version,
        dialogs = 0;

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
                        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                            token : token,
                            name  : 'Dialog ' + rand(),
                            source: 'Código ' + rand(),
                            slug  : 'slug-' + rand()
                        }, function (error, data) {
                            dialogs++;
                            if (dialogs === 20) {
                                done();
                            }
                        });
                    }
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialogs', {}, function(error, data, response) {
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
        api.get('apps', '/app/inexistente/version/' + version + '/dialogs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/dialogs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('lista de pelo menos 20 dialogs', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialogs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');           
                data.should.have.property('dialogs');
                for (var i = 0 ; i < data.dialogs.length; i = i + 1) {
                    data.dialogs[i].should.have.property('_id');
                    data.dialogs[i].should.have.property('name');
                    data.dialogs[i].should.have.property('source');
                }
                done();
            }
        });
    });
});

describe('GET /app/[slug]/version/[number]/dialog/[id]', function () {
    var token,
        slug,
        version,
        dialog;

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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        dialog = data.dialog.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {}, function(error, data, response) {
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
        api.get('apps', '/app/inexistente/version/' + version + '/dialog/' + dialog, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/dialog/' + dialog, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('dialog inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('dialog existente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('dialog');
                done();
            }
        });
    });
});

describe('DEL /app/[slug]/version/[number]/dialog/[id]', function () {
    var token,
        slug,
        version,
        dialog;

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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        dialog = data.dialog.slug;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {}, function(error, data, response) {
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
        api.del('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente/version/' + version + '/dialog/' + dialog, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('versão inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/inexistente/dialog/' + dialog, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('dialog inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/dialog/inexistente', {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('dialog existente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /app/[slug]/version/[number]/dialog/[id]', function () {
    var token,
        slug,
        version,
        dialog,
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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand(),
                        slug  : 'slug-' + rand()
                    }, function (error, data) {
                        dialog = data.dialog.slug;
                        name = data.dialog.name;
                        done();
                    });
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {}, function(error, data, response) {
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
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {
            token : 'invalido',
            name  : 'Dialog ' + rand(),
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
        api.put('apps', '/app/inexistente/version/' + version + '/dialog/' + dialog, {
                token : token,
                name  : 'Dialog ' + rand(),
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
        api.put('apps', '/app/' + slug + '/version/inexistente/dialog/' + dialog,{
                token : token,
                name  : 'Dialog ' + rand(),
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

    it('dialog inexistente', function(done) {
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/inexistente', {
                token : token,
                name  : 'Dialog ' + rand(),
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
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {
                token : token,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('dialog').have.property('name');
                    data.should.have.property('dialog').have.property('source');
                    done();
                }
            }
        );
    });

    it('dialog existente', function(done) {
        var new_name = 'Dialog ' + rand();
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {
                token : token,
                name  : new_name,
                source: 'Código ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    should.not.exist(data.error);
                    api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {token : token}, function (error, data) {
                        should.not.exist(data.error, 'algo deu errado');
                        data.should.have.property('dialog').have.property('name', new_name);
                        data.should.have.property('dialog').have.property('source');
                        done();
                    });
                }
            }
        );
    });
});