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
    rand = require("../Utils.js").rand,
    random, userName, appName1, appName2, appName3, slug1, slug2, slug3;

random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';

random = rand();
appName1 = "Aplicativo " + random;
slug1 = "aplicativo-" + random;

random = rand();
appName2 = "Aplicativo " + random;
slug2 = "aplicativo-" + random;

random = rand();
appName3 = "Aplicativo " + random;
slug3 = "aplicativo-" + random;

describe('POST /app', function () {
    var token;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            done();
        });
    });
/*
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

    it('dados obrigatórios não preenchidos', function(done) {
        api.post('apps', '/app', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    should.not.exist(data.slug);
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('apps', '/app', {
                token   : 'tokeninvalido',
                name    : 'testando serviço de apps',
                slug    : 'testando-app',
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    should.not.exist(data.slug);
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
                    should.not.exist(data.slug);
                    done();
                }
            }
        );
    });

    it('slug em branco', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : 'testando serviço de apps',
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    should.not.exist(data.slug);
                    done();
                }
            }
        );
    });

    it('cadastrar app gratuito', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : appName1,
                slug    : slug1,
                type    : 'free'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    console.log(data);
                    should.not.exist(data.error, 'erro inesperado');
                    should.exist(data._id, 'id');
                    done();
                }
            }
        );
    });

    it('cadastrar app pago', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : appName2,
                slug    : slug2,
                creator : userName,
                type    : 'payed'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    should.exist(data._id, 'id');
                    done();
                }
            }
        );
    });
*/
    it('cadastrar app compulsório', function(done) {
        api.post('apps', '/app', {
                token : token,
                name    : appName3,
                slug    : slug3,
                creator : userName,
                type    : 'compulsory'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    should.exist(data._id, 'id');
                    done();
                }
            }
        );
    });
    
    /*
    Cadastrar app já existente*/
});