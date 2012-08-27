/** Tests Talk.Conversant
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Conversant do serviço Talk
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;
    
describe('GET /country/[slugCountry]/state/[slugState]/cities', function () {
    it('url tem que existir', function(done) {
        api.post('location', '/country/'+countryId+'/state/'+stateId+'/cities/', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                done();
            }
        });
    });
    
    it('url tem que existir', function(done) {
        api.post('location', '/country/'+countryId+'/state/'+stateId+'/cities/', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                done();
            }
        });
    });
});