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
        api.post('apps', '/app/' + slug + '/version/inexistente/dialog', {
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : 'tokeninvalido',
                name    : 'Dialog ' + rand(),
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : token,
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
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token   : token,
                name    : 'Dialog ' + rand()
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

    it('cadastrar dialog', function(done) {
        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog', {
                token  : token,
                name    : 'Dialog ' + rand(),
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
                        api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                            token : token,
                            name  : 'Dialog ' + rand(),
                            source: 'Código ' + rand()
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
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/dialogs', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand()
                    }, function (error, data) {
                        dialog = data._id;
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
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('versão inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/inexistente/dialog/' + dialog, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('dialog inexistente', function(done) {
        api.get('apps', '/app/' + slug + '/version/' + version + '/dialog/inexistente', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
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
                data.should.have.property('_id');
                data.should.have.property('name');
                data.should.have.property('source');
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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand()
                    }, function (error, data) {
                        dialog = data._id;
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
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
                done();
            }
        });
    });

    it('app inexistente', function(done) {
        api.del('apps', '/app/inexistente/version/' + version + '/dialog/' + dialog, {token : token}, function(error, data, response) {
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
        api.del('apps', '/app/' + slug + '/version/inexistente/dialog/' + dialog, {token : token}, function(error, data, response) {
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

    it('dialog inexistente', function(done) {
        api.del('apps', '/app/' + slug + '/version/' + version + '/dialog/inexistente', {token : token}, function(error, data, response) {
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
        dialog;

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
                    api.post('apps', '/app/' + slug + '/version/' + version + '/dialog',  {
                        token : token,
                        name  : 'Dialog ' + rand(),
                        source: 'Código ' + rand()
                    }, function (error, data) {
                        dialog = data._id;
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
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
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
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('name');
                data.should.not.have.property('source');
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
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('name');
                    data.should.not.have.property('source');
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
        api.put('apps', '/app/' + slug + '/version/' + version + '/dialog/' + dialog, {
                token : token,
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
                    should.not.exist(data.error, 'erro inesperado');
                    should.exist(data);
                    data.should.have.property('_id');
                    data.should.have.property('name', new_name);
                    data.should.have.property('source');
                    done();
                }
            }
        );
    });
});