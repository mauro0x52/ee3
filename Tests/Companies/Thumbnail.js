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
	token, companyImageUrl, productImageUrl, random, 
	userName, companyName, productName, companySlug, productSlug,
	token2, userName2, companyName2, productName2, companySlug2, productSlug2;

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
				users : [data._id],
				name : companyName,
				slug : companySlug,
				activity : 'consultoria em testes',
				type : 'company',
				profile : 'both',
				active : true
			}, function(error, data) {
				console.log(data);
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
			function(error, data, response) {
				if (error) return done(error);
				else {
					should.exist(response, 'serviço de companies está inacessível');
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.exist(data.error, 'não retornou erro');
					done();
				}
			}
		);
	});
	/*
	it('retorna erro quando enviado token errado', function(done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : 'asd8vc89vc7vcx89fas872gjhibas',
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.exist(data && data.error ? true : undefined, 'não retornou erro');
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
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.not.exist(data.error);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
					(data && data.medium && data.medium.url ? data.medium.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
					(data && data.large && data.large.url ? data.large.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
					companyImageUrl = data.original.url;
					done();
				}
			}
		);
	});

	it('retorna informações das imagens quando enviar novamente', function (done) {
		api.file('companies', '/company/' + companySlug + '/thumbnail',
			{
				login : userName,
				token : token,
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.not.exist(data && data.error ? true : undefined);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
					(data && data.medium && data.medium.url ? data.medium.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
					(data && data.large && data.large.url ? data.large.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
					companyImageUrl.should.not.equal(data && data.original && data.original.url ? data.original.url : '', 'as urls deveriam ser diferentes');
					done();
				}
			}
		);
	});*/
});
/*
random = rand();
userName2 = 'testes+' + random + '@empreendemia.com.br';
companyName2 = 'Empresa ' + random;
companySlug2 = 'empresa-' + random;

describe('GET /company/[slug]/thumbnail', function () {

	before(function (done) {
		// cria usuario
		api.post('auth', '/user',
			{
				username : userName2,
				password : 'testando',
				password_confirmation : 'testando'
			},
			function(error, data) {
				token2 = data.token;
				// cria empresa
				api.post('companies', '/company',
					{
						login : userName2,
						token : token2,
						users : [userName2],
						name : companyName2,
						slug : companySlug2,
						activity : 'consultoria em testes',
						type : 'company',
						profile : 'both',
						active : true
					},
					function(error, data) {
						if (error) return done(error);
						else done();
					}
				);
			}
		);
	});


	it('retorna erro se não encontrar a empresa', function (done) {
		api.get('companies', '/company/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data && data.error ? true : undefined, 'não retornou erro');
			done();
		});
	});
	it('retorna informaçoes se a empresa existe e tem thumbnail', function (done) {
		api.get('companies', '/company/' + companySlug + '/thumbnail', {}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.not.exist(data && data.error ? true : undefined, 'retornou erro inexperado');
			(data && data.original && data.original.url ? data.original.url : '')
				.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
			(data && data.small && data.small.url ? data.small.url : '')
				.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
			(data && data.medium && data.medium.url ? data.medium.url : '')
				.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
			(data && data.large && data.large.url ? data.large.url : '')
				.should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
			done();
		});
	});
	it('retorna undefined se a empresa existe mas não e tem thumbnail', function (done) {
		api.get('companies', '/company/' + companySlug2 + '/thumbnail', {}, function(error, data, response) {
			response.should.have.status(200);
			should.not.exist(data, 'deveria retornar undefined')
			should.not.exist(data && data.error ? true : undefined, 'retornou erro inexperado');
			done();
		});
	});
});

describe('DEL /company/[slug]/thumbnail', function() {
	
});

productName = 'Produto ' + random;
productSlug = 'produto-' + random;


describe('POST /company/[slug]/product/[slug]/thumbnail', function () {
	before(function (done) {
		// cria produto
		api.post('companies', '/company/' + companyName + '/product', {
			login : userName,
			token : token,
			name : productName
		}, function(error, data, response) {
			if (error) return done(error);
			else done();
		});
	});
	it('retorna erro quando nao envia imagem', function (done) {
		api.file('companies', '/company/' + companySlug + '/product/' + productSlug + '/thumbnail',
			{
				login : userName,
				token : token
			},
			{},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data && data.error ? true : undefined, 'não retornou erro');
					done();
				}
			}
		);
	});
	it('retorna erro quando enviado token errado', function(done) {
		api.file('companies', '/company/' + companySlug + '/product/' + productSlug + '/thumbnail',
			{
				login : userName,
				token : 'asd8vc89vc7vcx89fas872gjhibas',
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data && data.error ? true : undefined, 'não retornou erro');
					done();
				}
			}
		);
	});
	it('retorna informações das imagens quando enviar imagem', function(done) {
		api.file('companies', '/company/' + companySlug + '/product/' + productSlug + '/thumbnail',
			{
				login : userName,
				token : token,
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.not.exist(data && data.error ? true : undefined);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
					(data && data.original && data.medium.url ? data.medium.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
					(data && data.original && data.large.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
					productImageUrl = data.original.url;
					done();
				}
			}
		);
	});
	
	
	it('retorna informações das imagens quando enviar novamente', function (done) {
		api.file('companies', '/company/' + companySlug + '/product/' + productSlug + '/thumbnail',
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
					should.not.exist(data && data.error ? true : undefined);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+', 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+', 'não salvou o small corretamente');
					(data && data.original && data.medium.url ? data.medium.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+', 'não salvou o medium corretamente');
					(data && data.original && data.large.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+', 'não salvou o large corretamente');
					productImageUrl.should.not.equal(data && data.original && data.large.url ? data.original.url : '', 'as urls deveriam ser diferentes');
					done();
				}
			}
		);
	});
});*/