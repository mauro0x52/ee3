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
	token, company, companyName, companySlug,
	token2, company2, companyName2, companySlug2;
	
random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';
companyName = 'Empresa ' + random;


describe('POST /company', function () {
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
	
	it('dados obrigatórios não preenchidos', function(done) {
		api.post('companies', '/company', {
			token : token
		}, function(error, data, response) {
			if (error) return done(error);
			else { 
				response.should.have.status(200);
				should.exist(data.error);
				should.not.exist(data.slug);
				done();
			}
		});
	});
	it('token inválido', function(done) {
		api.post('companies', '/company', {
			token : 'arbufudbcu1b3124913r987bass978a',
			name : companyName,
			activity : 'consultoria em testes',
			type : 'company',
			profile : 'both',
			active : 1
		}, function(error, data, response) {
			if (error) return done(error);
			else { 
				response.should.have.status(200);
				should.exist(data.error);
				should.not.exist(data.slug);
				done();
			}
		});
	});
	it('cadastra empresa', function(done) {
		api.post('companies', '/company', {
			token : token,
			name : companyName,
			activity : 'consultoria em testes',
			type : 'company',
			profile : 'both',
			active : 1
		}, function(error, data, response) {
			if (error) return done(error);
			else { 
				response.should.have.status(200);
				should.exist(data.slug, 'nao gerou slug corretamente');
				should.not.exist(data.error, 'erro inesperado');
				company = data;
				done();
			}
		});
	});
	it('cadastro com mesmo nome', function(done) {
		api.post('companies', '/company', {
			token : token,
			name : companyName,
			activity : 'consultoria em testes',
			type : 'company',
			profile : 'both',
			active : 1
		}, function(error, data, response) {
			if (error) return done(error);
			else { 
				response.should.have.status(200);
				should.exist(data.slug, 'nao gerou slug corretamente');
				should.not.exist(data.error, 'erro inesperado');
				(company.slug ? company.slug : '').should.not.equal(data.slug, 'slugs repetidos');
				done();
			}
		});
	});
});


describe('GET /companies', function () {
	before(function (done) {
		// cria 10 empresas
		var countCompanies = 0;
		for (var i = 0; i < 20; i++) {
			api.post('auth', '/user', {
				username : 'testes+b'+rand()+'@empreendemia.com.br',
				password : 'testando',
				password_confirmation : 'testando'
			}, function(error, data) {
				api.post('companies', '/company', {
					token : data.token,
					name : 'Empresa b'+rand(),
					activity : 'consultoria em testes',
					type : 'company',
					profile : 'both',
					active : 1
				}, function(error, data, response) {
					countCompanies++;
					if (countCompanies == 15) {
						done();
					}
				});
			});
		}
	});
	it('lista de empresas', function(done) {
		api.get('companies', '/companies',
			{},
			function(error, data, response) {
				if (error) return done(error);
				else { 
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					done();
				}
			}
		);
	});
	it('lista de 18 empresas', function(done) {
		api.get('companies', '/companies',
			{
				limit : 18
			},
			function(error, data, response) {
				if (error) return done(error);
				else { 
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					data.should.have.property('companies').with.lengthOf(18);
					done();
				}
			}
		);
	});
	it('tenta listar mais de 20 empresas', function(done) {
		api.get('companies', '/companies',
			{
				limit : 25
			},
			function(error, data, response) {
				if (error) return done(error);
				else { 
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					data.should.have.property('companies').with.lengthOf(20);
					done();
				}
			}
		);
	});
});


describe('GET /companies', function () {
	before(function (done) {
		// cria 10 empresas
		var countCompanies = 0;
		for (var i = 0; i < 20; i++) {
			api.post('auth', '/user', {
				username : 'testes+b'+rand()+'@empreendemia.com.br',
				password : 'testando',
				password_confirmation : 'testando'
			}, function(error, data) {
				api.post('companies', '/company', {
					token : data.token,
					name : 'Empresa b'+rand(),
					activity : 'consultoria em testes',
					type : 'company',
					profile : 'both',
					active : 1
				}, function(error, data, response) {
					countCompanies++;
					if (countCompanies == 15) {
						done();
					}
				});
			});
		}
	});
	it('lista de empresas', function(done) {
		api.get('companies', '/companies',
			{},
			function(error, data, response) {
				if (error) return done(error);
				else { 
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					done();
				}
			}
		);
	});
});