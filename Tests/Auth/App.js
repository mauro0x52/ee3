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
    token, login, nameApp, tokenApp, appId, userId;

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
                userId = data._id;
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
    it('página precisa existir', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('cadastro de sucesso', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data, "não retornou o token");
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId, {
            //token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
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
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId, {
            token : token+"asxzqwedcvfr"
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('app_id errado', function(done) {
        api.post('auth', '/user/'+userId+'/app/'+appId+"1213123123123", {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});

describe('DEL /user/[login]/app/[app_id]', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                userId = data._id;
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
    it('página não existe', function(done) {
        api.del('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('cadastro de sucesso', function(done) {
        api.del('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.del('auth', '/user/'+login+'/app/'+appId, {
            //token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('usuário não cadastrado', function(done) {
        api.del('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.del('auth', '/user/'+login+'/app/'+appId, {
            token : token+"asxzqwedcvfr"
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('app_id errado', function(done) {
        api.del('auth', '/user/'+userId+'/app/'+appId+"1213123123123", {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});

describe('GET /user/[login]/app/[app_id]', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                userId = data._id;
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
    it('página não existe', function(done) {
        api.get('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('cadastro de sucesso', function(done) {
        api.get('auth', '/user/'+userId+'/app/'+appId, {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.get('auth', '/user/'+login+'/app/'+appId, {
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
        api.get('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
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
        api.get('auth', '/user/'+login+'/app/'+appId, {
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
        api.get('auth', '/user/'+userId+'/app/'+appId+"1213123123123", {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});

describe('PUT /user/[login]/app/[app_id]', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                userId = data._id;
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
    it('página não existe', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('cadastro de sucesso', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.put('auth', '/user/'+login+'/app/'+appId, {
            //token : token
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('usuário não cadastrado', function(done) {
        api.put('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.put('auth', '/user/'+login+'/app/'+appId, {
            token : token+"asxzqwedcvfr",
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('app_id errado', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId+"1213123123123", {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});

describe('PUT /user/[login]/app/[app_id]/validate', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
                username : login,
                password : 'testando',
                password_confirmation : 'testando'
        }, function(error, data) {
                token = data.token;
                userId = data._id;
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
    it('página não existe', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('cadastro de sucesso', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data.error);
                done();
            }
        });
    });
    it('token não preenchidos', function(done) {
        api.put('auth', '/user/'+login+'/app/'+appId, {
            //token : token
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('usuário não cadastrado', function(done) {
        api.put('auth', '/user/766asdgqwyashasd11122ss/app/'+appId, {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('token errado', function(done) {
        api.put('auth', '/user/'+login+'/app/'+appId, {
            token : token+"asxzqwedcvfr",
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
    it('app_id errado', function(done) {
        api.put('auth', '/user/'+userId+'/app/'+appId+"1213123123123", {
            token : token,
            authorizationDate : new Date(),
            expirationDate : new Date()
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.token);
                done();
            }
        });
    });
});