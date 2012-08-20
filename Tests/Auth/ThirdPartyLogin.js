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
    rand = require("../Utils.js").rand,
    random, userName, userId, token;
		
random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';

describe('POST /user/'+userName+'/third-party-login', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'testando',
            token : token,
            id : userId,
            external_token : token+"asd"
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('cadastra third party login com sucesso', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'testando',
            token : token,
            id : userId,
            external_token : token+"asd"
        }, function (error, data, response) {
            should.not.exist(data.error, 'não deveria retornar erro');
            done();
        });
    });
    it('token em branco', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'testando',
            //token : token,
            id : userId,
            external_token : token+"asd"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.post('auth', '/user/'+userId+'/third-party-login', {
            server : 'testando',
            token : token+"123asd123",
            id : userId,
            external_token : token+"asd"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('usuário não cadastrado', function (done) {
        api.post('auth', '/user/'+userId+'123asd123/third-party-login', {
            server : 'testando',
            token : token,
            id : userId,
            external_token : token+"asd"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('External Token em branco', function (done) {
        api.post('auth', '/user/'+userId+'123asd123/third-party-login', {
            server : 'testando',
            token : token,
            id : userId,
            //external_token : token+"asd"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
});

describe('GET /user/'+userName+'/third-party-logins', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('lista logins externos com sucesso', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {
            token : token
        }, function (error, data, response) {
            should.not.exist(data.error, 'não deveria retornar erro');
            done();
        });
    });
    it('token em branco', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {
            //token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('usuário não cadastrado', function (done) {
        api.get('auth', '/user/'+userId+'asd123asd/third-party-logins', {
            token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-logins', {
            token : token+"asd123"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
});

describe('GET /user/'+userName+'/third-party-login', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('lista logins externos de um servidor com sucesso', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            should.not.exist(data.error, 'não deveria retornar erro');
            done();
        });
    });
    it('token em branco', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/testando', {
            //token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('usuário não cadastrado', function (done) {
        api.get('auth', '/user/'+userId+'asd123asd/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('servidor não cadastrado', function (done) {
        api.get('auth', '/user/'+userId+'asd123asd/third-party-login/testando123asd123', {
            token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.get('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token+"asd123"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
});

describe('DEL /user/'+userName+'/third-party-login', function () {
    before(function (done) {
        // cria um usuario
        api.post('auth', '/user/', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('deltar logins externos de um servidor com sucesso', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            should.not.exist(data.error, 'não deveria retornar erro');
            done();
        });
    });
    it('token em branco', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/testando', {
            //token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('usuário não cadastrado', function (done) {
        api.del('auth', '/user/'+userId+'asd123asd/third-party-login/testando', {
            token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('servidor não cadastrado', function (done) {
        api.del('auth', '/user/'+userId+'asd123asd/third-party-login/testando123asd123', {
            token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.del('auth', '/user/'+userId+'/third-party-login/testando', {
            token : token+"asd123"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
});