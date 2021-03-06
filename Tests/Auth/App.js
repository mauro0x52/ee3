/** Tests Companies.Company
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Company do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /user/[login]/app/[app_id]', function () {
    var token,
        userId,
        tokenApp,
        appId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            // cria um app
            api.post('apps','/app', {
                token : token,
                name  : 'App ' + rand(),
                type  : 'free'
            }, function(error, data) {
                tokenApp = data.app.token;
                appId = data.app._id;
                done();
            });
        });
    });

    it('página precisa existir', function(done) {
        api.post('auth', '/user/' + userId + '/app/' + appId, { }, function(error, data, response) {
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
        api.post('auth', '/user/' + userId+'/app/' + appId, {token : 'tokeninvalido'}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function(done) {
        api.post('auth', '/user/inexistente/app/' + appId, {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('aplicativo autorizado', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('authorizedApp').have.property('_id');
                data.should.have.property('authorizedApp').have.property('appId');
                data.should.have.property('authorizedApp').have.property('token');
                done();
            }
        });
    });
});

describe('DEL /user/[login]/app/[app_id]', function () {
    var token,
        userId,
        tokenApp,
        appId,
        auth;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            // cria um app
            api.post('apps','/app', {
                token : token,
                name  : 'App ' + rand(),
                type  : 'free'
            }, function(error, data) {
                tokenApp = data.app.token;
                appId = data.app._id;
                api.post('auth', '/user/' + userId + '/app/' + appId, {token : token}, function (error, data) {
                    auth = data.token;
                    done();
                });
            });
        });
    });

    it('página não existe', function(done) {
        api.del('auth', '/user/'+userId+'/app/'+appId, {}, function(error, data, response) {
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
        api.del('auth', '/user/'+userId+'/app/'+appId, {token : 'tokeninválido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function(done) {
        api.del('auth', '/user/inexistente/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('remoção da autenticação', function(done) {
        api.del('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('auth', '/user/'+userId+'/app/' + appId, {token : token}, function (error, data) {
                    data.should.have.property('error').have.property('name', 'DeniedTokenError');
                    done();
                });
            }
        });
    });
});

describe('GET /user/[login]/app/[app_id]', function () {
    var token,
        userId,
        tokenApp,
        appId,
        auth;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            // cria um app
            api.post('apps','/app', {
                token : token,
                name  : 'App ' + rand(),
                type  : 'free'
            }, function(error, data) {
                tokenApp = data.app.token;
                appId = data.app._id;
                api.post('auth', '/user/' + userId + '/app/' + appId, {token : token}, function (error, data) {
                    auth = data.token;
                    done();
                });
            });
        });
    });

    it('página não existe', function(done) {
        api.get('auth', '/user/'+userId+'/app/'+appId, {}, function(error, data, response) {
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
        api.get('auth', '/user/'+userId+'/app/'+appId, {token : 'tokeninválido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function(done) {
        api.get('auth', '/user/inexistente/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('aplicativo inexistente', function(done) {
        api.get('auth', '/user/'+userId+'/app/inexistente', {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'DeniedTokenError');
                done();
            }
        });
    });

    it('exibição da autenticação', function(done) {
        api.get('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('authorizedApp').have.property('appId');
                data.should.have.property('authorizedApp').have.property('token');
                done();
            }
        });
    });
});

describe('PUT /user/[login]/app/[app_id]', function () {
    var token,
        userId,
        tokenApp,
        appId,
        auth;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : 'testes+' + rand() + '@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            // cria um app
            api.post('apps','/app', {
                token : token,
                name  : 'App ' + rand(),
                type  : 'free'
            }, function(error, data) {
                tokenApp = data.app.token;
                appId = data.app._id;
                api.post('auth', '/user/' + userId + '/app/' + appId, {token : token}, function (error, data) {
                    auth = data.token;
                    done();
                });
            });
        });
    });

    it('página não existe', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {}, function(error, data, response) {
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
        api.put('auth', '/user/'+userId+'/app/'+appId, {token : 'tokeninválido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function(done) {
        api.put('auth', '/user/inexistente/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('aplicativo inexistente', function(done) {
        api.put('auth', '/user/'+userId+'/app/inexistente', {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error').have.property('name', 'DeniedTokenError');
                done();
            }
        });
    });

    it('edição da autenticação', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                api.get('auth', '/user/'+userId+'/app/'+appId, {token : token}, function (error, data) {
                    data.should.not.have.property('error');
                    data.should.have.property('authorizedApp').have.property('_id');
                    data.should.have.property('authorizedApp').have.property('appId');
                    data.should.have.property('authorizedApp').have.property('token');
                    done();
                });
            }
        });
    });
});