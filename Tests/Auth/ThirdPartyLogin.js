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
            token = data.token;
            userId = data._id;
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('status');
                data.should.not.have.property('username');
                data.should.not.have.property('thirdPartyLogins');
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('status');
                data.should.not.have.property('username');
                data.should.not.have.property('thirdPartyLogins');
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('status');
                data.should.not.have.property('username');
                data.should.not.have.property('thirdPartyLogins');
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('status');
                data.should.not.have.property('username');
                data.should.not.have.property('thirdPartyLogins');
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
                should.not.exist(data.error, 'não deveria retornar erro');
                data.should.have.property('_id');
                data.should.have.property('server');
                data.should.have.property('token');
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
            token = data.token;
            userId = data._id;
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('status');
                data.should.not.have.property('username');
                data.should.not.have.property('thirdPartyLogins');
                done();
            }
        });
    });
    
    it('usuário inexistente', function (done) {
        api.get('auth', '/user/inexistente/third-party-logins', {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });

    it('lista logins externos', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('id');
                    data[i].should.have.property('server');
                    data[i].should.have.property('token');
                    data[i].should.have.property('_id');
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
            token = data.token;
            userId = data._id;
            api.post('auth', '/user/' + userId + '/third-party-login', {
                server : 'Server ' + rand(),
                token : token,
                id : 'Id ' + rand(),
                external_token : 'Token ' + rand()
            }, function (error, data, response) {
                third = data._id;
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
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('server');
                data.should.not.have.property('id');
                data.should.not.have.property('token');
                done();
            }
        });
    });
    
    it('usuário inexistente', function (done) {
        api.get('auth', '/user/inexistente/third-party-login/' + third, {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('server');
                data.should.not.have.property('id');
                data.should.not.have.property('token');
                done();
            }
        });
    });
    
    it('third party login inexistente', function (done) {
        api.get('auth', '/user/' + userId + '/third-party-login/inexistente', {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                data.should.not.have.property('_id');
                data.should.not.have.property('server');
                data.should.not.have.property('id');
                data.should.not.have.property('token');
                done();
            }
        });
    });

    it('exibe login externo', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/' + third, {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('id');
                data.should.have.property('server');
                data.should.have.property('token');
                data.should.have.property('_id');
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
            token = data.token;
            userId = data._id;
            api.post('auth', '/user/' + userId + '/third-party-login', {
                server : 'Server ' + rand(),
                token : token,
                id : 'Id ' + rand(),
                external_token : 'Token ' + rand()
            }, function (error, data, response) {
                third = data._id;
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
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });
    
    it('usuário inexistente', function (done) {
        api.del('auth', '/user/inexistente/third-party-login/' + third, {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });
    
    it('third party login inexistente', function (done) {
        api.del('auth', '/user/' + userId + '/third-party-login/inexistente', {}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });

    it('exibe login externo', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/' + third, {token : token}, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data, 'erro inesperado');
                done();
            }
        });
    });
});