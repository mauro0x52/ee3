/** Testes do Companies.Thumbnail
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thumbnail do serviço Companies
 */

var should = require("should"),
	api = require("../Utils.js").api,
	db = require("../Utils.js").db,
	rand = require("../Utils.js").rand,
	token, imageUrl, random, 
	userName, companyName, productName, companySlug, productSlug;
		
random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';
companyName = 'Empresa ' + random;
companySlug = 'empresa-' + random;

describe('POST /company/[slug]/thumbnail', function () {
	before(function (done) {
		// cria usuario
		api.post('auth', '/user', {
			username : userName,
			password : 'testando',
			password_confirmation : 'testando'
		}, function(error, data) {
			token = data.token;
			// cria empresa
			api.post('companies', '/company', {
				login : userName,
				token : token,
				users : [userName],
				name : companyName,
				slug : companySlug,
				activity : 'consultoria em testes',
				type : 'company',
				profile : 'both',
				active : true
			}, function(error, data) {
				if (error) return done(error);
				else done();
			});
		});
	});

	it('retorna erro quando nao envia imagem', function(done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : token
			},
			{},
			function(error, data) {
				if (error) return done(error);
				else {
					should.exist(data.error, 'não retornou erro');
					done();
				}
			}
		);
	});
	
	it('retorna erro quando enviado token errado', function(done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : 'asd8vc89vc7vcx89fas872gjhibas',
			},
			{
				file : 'vader.jpg'
			},
			function(error, data) {
				if (error) return done(error);
				else {
					should.exist(data.error, 'não retornou erro');
					done();
				}
			}
		);
	});
	
	it('retorna informações das imagens quando enviar imagem', function(done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : token,
			},
			{
				file : 'vader.jpg'
			},
			function(error, data) {
				if (error) return done(error);
				else {
					should.not.exist(data.error, 'erro não esperado');
					should.exist(data.original.url, 'data.original.url esperado');
					should.exist(data.small.url, 'data.small.url esperado');
					should.exist(data.medium.url, 'data.medium.url esperado');
					should.exist(data.large.url, 'data.large.url esperado');
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/original\..+').test(data.original.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/small\..+').test(data.small.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/medium\..+').test(data.medium.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/large\..+').test(data.large.url));
					imageUrl = data.original.url;
					done();
				}
			}
		);
	});
	
	it('retorna informações das imagens quando enviar novamente', function(done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : token,
			},
			{
				file : 'vader.jpg'
			},
			function(error, data) {
				if (error) return done(error);
				else {
					should.not.exist(data.error, 'erro não esperado');
					should.exist(data.original.url, 'data.original.url esperado');
					should.exist(data.small.url, 'data.small.url esperado');
					should.exist(data.medium.url, 'data.medium.url esperado');
					should.exist(data.large.url, 'data.large.url esperado');
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/original\..+').test(data.original.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/small\..+').test(data.small.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/medium\..+').test(data.medium.url));
					should.equal(true, new RegExp('http\:\/\/.+\/company\/.+\/thumbnail\/.+\/large\..+').test(data.large.url));
					imageUrl.should.not.equal(data.original.url, 'as urls deveriam ser diferentes');
					done();
				}
			}
		);
	});
	
});



productName = 'Produto ' + random;
productSlug = 'produto-' + random;

/*
describe('POST /company/[slug]/product/[slug]/thumbnail', function () {
	before(function (done) {
		// cria produto
		api.post('companies', '/company/testes-corporation/product', {
			login : 'testes@empreendemia.com.br',
			token : token,
			name : 'Produto da Hora'
		}, function(error, data) {
			if (error) return done(error);
			else done();
		});
	});
	it('retorna erro', function() {
		
	});
});
*/