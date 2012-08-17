/** Testes  Profiles.Thumbnail
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thumbnail do serviço Profiles
 */

var should = require("should"),
	api = require("../Utils.js").api,
	rand = require("../Utils.js").rand;

random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';
profileName = 'Empresa ' + random;

describe('POST /company/[id]/thumbnail', function () {
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
				token : token,
				name : companyName,
				activity : 'consultoria em testes',
				type : 'company',
				profile : 'both',
				active : true
			}, function(error, data) {
				company = data;
				if (error) return done(error);
				else done();
			});
		});
	});

	it('não envia imagem', function(done) {
		api.file('companies', '/company/' + company.slug + '/thumbnail',
			{
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
	it('token errado', function(done) {
		api.file('companies', '/company/' + company.slug  + '/thumbnail',
			{
				token : 'asd8vc89vc7vcx89fas872gjhibas'
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
	it('envia imagem', function(done) {
		api.file('companies', '/company/' + company.slug  + '/thumbnail',
			{
				token : token
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

	it('envia imagem novamente', function (done) {
		api.file('companies', '/company/' + company.slug  + '/thumbnail',
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
	});
});

random = rand();
userName2 = 'testes+' + random + '@empreendemia.com.br';
companyName2 = 'Empresa ' + random;

describe('GET /company/[id]/thumbnail', function () {

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
						activity : 'consultoria em testes',
						type : 'company',
						profile : 'both',
						active : true
					},
					function(error, data) {
						company2 = data;
						if (error) return done(error);
						else done();
					}
				);
			}
		);
	});

	it('empresa não existe', function (done) {
		api.get('companies', '/company/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
			response.should.have.status(200);
			should.exist(data, 'não retornou dado nenhum');
			should.exist(data && data.error ? true : undefined, 'não retornou erro');
			done();
		});
	});
	it('empresa com thumbnail', function (done) {
		api.get('companies', '/company/' + company.slug + '/thumbnail', {}, function(error, data, response) {
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
	it('empresa sem thumbnail', function (done) {
		api.get('companies', '/company/' + company2.slug  + '/thumbnail', {}, function(error, data, response) {
			response.should.have.status(200);
			should.not.exist(data, 'deveria retornar undefined')
			should.not.exist(data && data.error ? true : undefined, 'retornou erro inexperado');
			done();
		});
	});
});

describe('DEL /company/[id]/thumbnail', function() {
	
});

productName = 'Produto ' + random;


describe('POST /company/[id]/product/[id]/thumbnail', function () {

	before(function (done) {
		// cria produto
		api.post('companies', '/company/' + company.slug + '/product', {
			token : token,
			name : productName
		}, function(error, data, response) {
			product = data;
			if (error) return done(error);
			else done();
		});
	});
	it('não envia imagem', function (done) {
		api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
			{
				token : token
			},
			{},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data.error, 'não retornou erro');
					done();
				}
			}
		);
	});
	it('token errado', function(done) {
		api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
			{
				token : 'asd8vc89vc7vcx89fas872gjhibas'
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data.error, 'não retornou erro');
					done();
				}
			}
		);
	});
	it('envia imagem de produto', function(done) {
		api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
			{
				token : token
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.not.exist(data.error, 'erro indesejado');
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
					(data && data.medium && data.medium.url ? data.medium.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
					(data && data.large && data.large.url ? data.large.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
					productImageUrl = data.original.url;
					done();
				}
			}
		);
	});	
	it('envia mesma imagem de produto', function (done) {
		api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
			{
				token : token
			},
			{
				file : 'vader.jpg'
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.exist(data, 'não retornou dado nenhum');
					should.not.exist(data.error, 'erro indesejado');
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
					(data && data.medium && data.medium.url ? data.medium.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
					(data && data.large && data.large.url ? data.large.url : '')
						.should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
					productImageUrl.should.not.equal(data && data.original && data.large.url ? data.original.url : '', 'as urls deveriam ser diferentes');
					done();
				}
			}
		);
	});
});