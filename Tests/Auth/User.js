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
	random, userName,
	token;
		
random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';

describe('POST /user', function () {

	it('retorna erro se não preencher username', function (done) {
		api.post('auth', '/user', {
			password : 'testando',
			password_confirmation : 'testando'
		}, function (error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data.error, 'deveria retornar erro');
			done();
		});
	});
	it('retorna erro se não preencher username incorretamente', function (done) {
		api.post('auth', '/user', {
			username : 'testes'
		}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data.error, 'deveria retornar erro');
			done();
		});
	});
	it('retorna erro se não preencher password', function (done) {
		api.post('auth', '/user', {
			username : userName
		}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data.error, 'deveria retornar erro');
			done();
		});
	});
	it('retorna erro se preencher password_confirmation incorretamente', function(done) {
		api.post('auth', '/user', {
			username : userName,
			password : 'testando',
			password_confirmation : 'asuidiudhsas'
		}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data.error, 'deveria retornar erro');
			done();
		});
	});
	it('retorna token se o cadastro for sucesso', function(done) {
		api.post('auth', '/user', {
			username : userName,
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.not.exist(data.error);
			should.exist(data.token);
			token = data.token;
			done();
		});
	});
	it('retorna erro se tenta cadastrar username que já existe', function(done) {
		api.post('auth', '/user', {
			username : userName,
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data.error);
			done();
		});
	});
});

describe('GET /user/validate', function() {
	it('retorna id do usuário se o token for valido', function (done) {
		api.get('auth', '/user/validate', 
			{
				token : token
			},
			function(error, data, response) {
				response.should.have.status(200);
				should.exist(data, 'não retornou dado nenhum');
				should.not.exist(data.error);
				should.exist(data._id);
				done();
			}
		);
	});
});

