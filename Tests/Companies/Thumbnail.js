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
	token, companyImageUrl, productImageUrl random, 
	userName, companyName, productName, companySlug, productSlug;

object.prototype.should.exist = should.exist; 

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
					should.exist(data && data.error ? true : false, 'não retornou erro');
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
					should.exist(data && data.error ? true : false, 'não retornou erro');
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
					should.not.exist(data && data.error ? true : undefined);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+', 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+', 'não salvou o small corretamente');
					(data && data.original && data.medium.url ? data.medium.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+', 'não salvou o medium corretamente');
					(data && data.original && data.large.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+', 'não salvou o large corretamente');
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
			function(error, data) {
				if (error) return done(error);
				else {
					should.not.exist(data && data.error ? true : undefined);
					(data && data.original && data.original.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+', 'não salvou o original corretamente');
					(data && data.small && data.small.url ? data.small.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+', 'não salvou o small corretamente');
					(data && data.original && data.medium.url ? data.medium.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+', 'não salvou o medium corretamente');
					(data && data.original && data.large.url ? data.original.url : '')
						.should.match('http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+', 'não salvou o large corretamente');
					companyImageUrl.should.not.equal(data && data.original && data.large.url ? data.original.url : '', 'as urls deveriam ser diferentes');
					done();
				}
			}
		);
	});
	
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
		}, function(error, data) {
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
			function(error, data) {
				if (error) return done(error);
				else {
					should.exist(data && data.error ? true : false, 'não retornou erro');
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
			function(error, data) {
				if (error) return done(error);
				else {
					should.exist(data && data.error ? true : false, 'não retornou erro');
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
					productImageUrl = data.original.url;
					done();
				}
			}
		);
	});
});
