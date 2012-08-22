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
    var countryId, stateId;
    
    before(function (done) {
        // cria Country
        api.post('location', '/country', {
            nome : 'testes+' + rand(),
            acronym : 'testando',
            slug : 'testando' + rand(),
            ddi : rand()
        }, function(error,data) {
            if (error) {
                console.log(error);
            } else {
                countryId : data._id;
            }
            done();
        });
        
        // cria Estado
        api.post('location', '/state', {
            nome : 'testes+' + rand(),
            slug : 'testando' + rand(),
            countryId : countryId
        }, function(error, data) {
            if (error) {
                console.log(error);
            } else {
                stateId : data._id;
            }
            done();
        });
        
        // cria Cidades
        for(i=0;i<20;i++) {
            // cria cidade
            api.post('location', '/city', {
                nome : 'testes+' + rand(),
                slug : 'testando' + rand(),
                ddd  : rand(),
                stateId : stateId
            }, function(error, data) {
                if (error) {
                    console.log(error);
                }
                done();
            });
        }
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