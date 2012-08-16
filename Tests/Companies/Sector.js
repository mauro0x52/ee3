/** Tests Companies.Sector
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Sector do serviço Companies
 */

var should = require("should"),
	api = require("../Utils.js").api;
	


describe('GET /sectors', function () {
	it ('retorna todos os setores', function(done) {
		api.get('companies', '/sectors',
			{
				
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					should.exist(data[0] && data[0]._id ? true : undefined);
					should.exist(data[0] && data[0].slug ? true : undefined);
					should.exist(data[0] && data[0].name ? true : undefined);
					data.length.should.be.above(10);
					done();
				}
			}
		);
	});
});



describe('GET /sector', function () {
	it ('setor civil', function(done) {
		api.get('companies', '/sector/civil',
			{
				
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					data.should.have.property('_id');
					data.should.have.property('slug', 'civil');
					done();
				}
			}
		);
	});
	it ('setor industria', function(done) {
		api.get('companies', '/sector/industria',
			{
				
			},
			function(error, data, response) {
				if (error) return done(error);
				else {
					response.should.have.status(200);
					should.not.exist(data.error, 'erro inesperado');
					data.should.have.property('_id');
					data.should.have.property('slug', 'industria');
					done();
				}
			}
		);
	});
});