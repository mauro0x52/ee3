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
	rand = require("../Utils.js").rand,
	token, login, nameApp, tokenApp, appId;
	
random = rand();
login = 'testes+' + random + '@empreendemia.com.br';
nameApp = 'testesApp' + random + '';

describe('POST /user/[login]/app/[app_id]', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                done();
        });
        // cria um app
        api.post('apps','/app', {
            creator : login,
            token : token,
            name  : nameApp,
            type  : 'free'
        }, function(error, data) {
            tokenApp = data.token;
            appId = data._id;
        });
    });
    it('cadastro de sucesso', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data, "não retornou o token");
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            //token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('usuário não cadastrado', function(done) {
        api.post('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            token : token+"asxzqwedcvfr"
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('app_id errado', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId+"1213123123123", {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});

describe('POST /user/[login]/app/[app_id]', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                done();
        });
        // cria um app
        api.post('apps','/app', {
            creator : login,
            token : token,
            name  : nameApp,
            type  : 'free'
        }, function(error, data) {
            tokenApp = data.token;
            appId = data._id;
        });
    });
    it('cadastro de sucesso', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data, "não retornou o token");
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            //token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.post('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.post('auth', '/user/'+login+'/app/'+appId, {
            token : token+"asxzqwedcvfr"
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});