/** Testes do Auth.User
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller User do serviço Auth
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /user/[id]/third-party-login', function () {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            done();
        });
    });

    it('página não encontrada', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'Server ' + rand(),
            token : 'tokeninvalido',
            id : 'Id ' + rand(),
            external_token : 'Token ' + rand()
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function (done) {
        api.post('auth', '/user/inexistente/third-party-login', {
            server : 'Server ' + rand(),
            token : 'tokeninvalido',
            id : 'Id ' + rand(),
            external_token : 'Token ' + rand()
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('server em branco', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            token : token,
            id : 'Id ' + rand(),
            external_token : 'Token ' + rand()
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('external token em branco', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'Server ' + rand(),
            token : token,
            id : 'Id ' + rand()
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'ValidationError');
                done();
            }
        });
    });

    it('cadastra third party login', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'Server ' + rand(),
            token : token,
            id : 'Id ' + rand(),
            external_token : 'Token ' + rand()
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('thirdPartyLogin').have.property('_id');
                data.should.have.property('thirdPartyLogin').have.property('server');
                data.should.have.property('thirdPartyLogin').have.property('token');
                done();
            }
        });
    });
});

describe('GET /user/[id]/third-party-logins', function () {
    var token,
        userId,
        thirds = 0;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            for (var i = 0; i < 20; i = i + 1) {
                api.post('auth', '/user/' + userId + '/third-party-login', {
                    server : 'Server ' + rand(),
                    token : token,
                    id : 'Id ' + rand(),
                    external_token : 'Token ' + rand()
                }, function (error, data, response) {
                    thirds++;
                    if (thirds === 20) {
                        done();
                    }
                });
            }
        });
    });

    it('página não encontrada', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {token : 'tokeninvalido'}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function (done) {
        api.get('auth', '/user/inexistente/third-party-logins', {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('lista logins externos', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('thirdPartyLogins');
                for (var i = 0 ; i < data.thirdPartyLogins.length; i = i + 1) {
                    data.thirdPartyLogins[i].should.have.property('id');
                    data.thirdPartyLogins[i].should.have.property('server');
                    data.thirdPartyLogins[i].should.have.property('token');
                    data.thirdPartyLogins[i].should.have.property('_id');
                }
                done();
            }
        });
    });
});

describe('GET /user/[id]/third-party-login', function () {
    var token,
        userId,
        third;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            api.post('auth', '/user/' + userId + '/third-party-login', {
                server : 'Server ' + rand(),
                token : token,
                id : 'Id ' + rand(),
                external_token : 'Token ' + rand()
            }, function (error, data, response) {
                third = data.thirdPartyLogin._id;
                done()
            });
        });
    });

    it('página não encontrada', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/'+third, {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/'+third, {token : 'tokeninvalido'}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function (done) {
        api.get('auth', '/user/inexistente/third-party-login/' + third, {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('third party login inexistente', function (done) {
        api.get('auth', '/user/' + userId + '/third-party-login/inexistente', {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibe login externo', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/' + third, {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('thirdPartyLogin').have.property('id');
                data.should.have.property('thirdPartyLogin').have.property('server');
                data.should.have.property('thirdPartyLogin').have.property('token');
                data.should.have.property('thirdPartyLogin').have.property('_id');
                done();
            }
        });
    });
});

describe('DEL /user/[id]/third-party-login', function () {
    var token,
        userId,
        third;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            userId = data.user._id;
            api.post('auth', '/user/' + userId + '/third-party-login', {
                server : 'Server ' + rand(),
                token : token,
                id : 'Id ' + rand(),
                external_token : 'Token ' + rand()
            }, function (error, data, response) {
                third = data.thirdPartyLogin._id;
                done()
            });
        });
    });

    it('página não encontrada', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/'+third, {}, function (error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/'+third, {token : 'tokeninvalido'}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('usuário inexistente', function (done) {
        api.del('auth', '/user/inexistente/third-party-login/' + third, {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('third party login inexistente', function (done) {
        api.del('auth', '/user/' + userId + '/third-party-login/inexistente', {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                data.should.have.property('error').have.property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('remove login externo', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/' + third, {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                api.get('auth', '/user/'+userId+'/third-party-login/' + third, {token : token}, function (error, data) {
                    data.should.have.property('error').have.property('name', 'NotFoundError');
                    done();
                });
            }
        });
    });
});