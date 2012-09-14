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
                    data.should.not.have.property('error');
                    should.exist(data.sectors[0] && data.sectors[0]._id ? true : undefined);
                    should.exist(data.sectors[0] && data.sectors[0].slug ? true : undefined);
                    should.exist(data.sectors[0] && data.sectors[0].name ? true : undefined);
                    data.sectors.length.should.be.above(10);
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
                    data.should.not.have.property('error');
                    data.should.have.property('sector').have.property('_id');
                    data.should.have.property('sector').have.property('slug', 'civil');
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
                    data.should.not.have.property('error');
                    data.should.have.property('sector').have.property('_id');
                    data.should.have.property('sector').have.property('slug', 'industria');
                    done();
                }
            }
        );
    });
    it ('setor inexistente', function(done) {
        api.get('companies', '/sector/dfg89798ay4hg1u23nerwfs',
            {

            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    data.should.have.property('error').property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });
});