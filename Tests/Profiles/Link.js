/** Tests Profiles.link
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller link do serviço Profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /profile/[slug]/link', function () {
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
                name : "Nome" + rand(),
                surname : "Sobrenome" + rand(),
                about : rand()
            }, function(error, data, response) {
                profile = data.profile.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('profiles', '/profile/' + profile + '/link', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('profile inexistente', function(done) {
        api.post('profiles', '/profile/inexistente/link', {
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
        api.post('profiles', '/profile/' + profile + '/link', {
                token     : 'tokeninvalido',
                url     : 'Url ' + rand(),
                type    : 'youtube'
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

    it('url em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/link', {
                token   : token,
                type    : 'youtube'
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
        api.post('profiles', '/profile/' + profile + '/link', {
                token   : token,
                url     : 'Url ' + rand()
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
        api.post('profiles', '/profile/' + profile + '/link', {
                token   : token,
                url     : 'Url ' + rand(),
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

    it('cadastra link', function(done) {
        var url = 'Url ' + rand(),
            type = 'youtube';
        api.post('profiles', '/profile/' + profile + '/link', {
                token   : token,
                url     : url,
                type    : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else {
                    data.should.not.have.property('error');
                    data.should.have.property('link').have.property('_id');
                    data.should.have.property('link').have.property('url', url);
                    data.should.have.property('link').have.property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /profile/[slug]/links', function () {
    var token,
        slug,
        version,
        profile,
        linkes = 0;

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
                name : "Nome" + rand(),
                surname : "Sobrenome" + rand(),
                about : rand()
            }, function(error, data, response) {
                profile = data.profile.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('profiles', '/profile/' + profile + '/link', {
                        token   : token,
                        url     : 'Url ' + rand(),
                        type    : 'youtube'
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
        api.get('profiles', '/profile/' + profile + '/links', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('profile inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/links', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('listar links', function(done) {
        api.get('profiles', '/profile/' + profile + '/links', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.links.length.should.be.above(19);
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

describe('GET /profile/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        profile,
        link;

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
                name : "Nome" + rand(),
                surname : "Sobrenome" + rand(),
                about : rand()
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'youtube'
                }, function(error, data, response) {
                    link = data.link._id
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/link/' + link, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('profile inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/link/' + link, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibir link', function(done) {
        api.get('profiles', '/profile/' + profile + '/link/' + link, {}, function(error, data, response) {
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

describe('DEL /profile/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        profile,
        link;

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
                name : "Nome" + rand(),
                surname : "Sobrenome" + rand(),
                about : rand()
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'youtube'
                }, function(error, data, response) {
                    link = data.link._id
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.del('profiles', '/profile/' + profile + '/link/' + link, {}, function(error, data, response) {
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
        api.del('profiles', '/profile/' + profile + '/link/' + link, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('profile inexistente', function(done) {
        api.del('profiles', '/profile/inexistente/link/' + link, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('remove link', function(done) {
        api.del('profiles', '/profile/' + profile + '/link/' + link, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('profiles', '/profile/' + profile + '/link/' + link, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /profile/[slug]/link/[id]', function () {
    var token,
        slug,
        version,
        profile,
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
            api.post('profiles', '/profile', {
                token : token,
                name : "Nome" + rand(),
                surname : "Sobrenome" + rand(),
                about : rand()
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/link', {
                    token   : token,
                    url     : 'Url ' + rand(),
                    type    : 'youtube'
                }, function(error, data, response) {
                    link = data.link._id;
                    obj = data.link;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('profiles', '/profile/' + profile + '/link/' + link, {}, function(error, data, response) {
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
        api.put('profiles', '/profile/' + profile + '/link/' + link, {
            token : 'invalido',
            url     : 'Url ' + rand(),
            type    : 'youtube'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('profile inexistente', function(done) {
        api.put('profiles', '/profile/inexistente/link/' + link, {
            token : token,
            url     : 'Url ' + rand(),
            type    : 'youtube'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('url em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/link/' + link, {
            token : token,
            type    : 'youtube'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.link;
                data.should.not.have.property('error');
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('url', obj.url);
                done();
            }
        });
    });

    it('type em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/link/' + link, {
            token : token,
            url     : 'Url ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.link;
                data.should.not.have.property('error');
                data.should.have.property('link').have.property('_id');
                data.should.have.property('link').have.property('type', obj.type);
                done();
            }
        });
    });

    it('edita link', function(done) {
        var url  = 'Url ' + rand(),
            type = 'youtube';
        api.put('profiles', '/profile/' + profile + '/link/' + link, {
            token : token,
            url     : url,
            type    : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                api.get('profiles', '/profile/' + profile + '/link/' + link, {token : token}, function (error, data) {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('link').have.property('_id');
                    data.should.have.property('link').have.property('url', url);
                    data.should.have.property('link').have.property('type', type);
                    done();
                });
            }
        });
    });
});