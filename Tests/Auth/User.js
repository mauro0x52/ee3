/** Testes do Auth.User
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller User do serviço Auth
 */

var should = require("should"),
	api = require("../Utils.js").api,
	db = require("../Utils.js").db;

describe('POST /user', function () {
	before(function(done) {
		db.dropCollection('auth', 'users', function (error) {
			if (error) return done(error);
			else done();
		});
	});

	it('retorna erro se não preencher username', function (done) {
		api.post('auth', '/user', {
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.exist(data.error);
			done();
		});
	});
	it('retorna erro se não preencher username incorretamente', function (done) {
		api.post('auth', '/user', {
			username : 'testes'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.exist(data.error);
			done();
		});
	});
	it('retorna erro se não preencher password', function (done) {
		api.post('auth', '/user', {
			username : 'testes@empreendemia.com.br'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.exist(data.error);
			done();
		});
	});
	it('retorna erro se preencher password_confirmation incorretamente', function(done) {
		api.post('auth', '/user', {
			username : 'testes@empreendemia.com.br',
			password : 'testando',
			password_confirmation : 'asuidiudhsas'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.exist(data.error);
			done();
		});
	});
	it('retorna token se o cadastro for sucesso', function(done) {
		api.post('auth', '/user', {
			username : 'testes@empreendemia.com.br',
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.not.exist(data.error);
			should.exist(data.token);
			done();
		});
	});
	it('retorna erro se tenta cadastrar username que já existe', function(done) {
		api.post('auth', '/user', {
			username : 'testes@empreendemia.com.br',
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data) {
			should.strictEqual(undefined, error);
			should.exist(data.error);
			done();
		});
	});
});

