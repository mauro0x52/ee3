/** Tests Companies.Product
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Product do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    token, company, product,
    token2, company2, companyName2, companySlug2;
    

describe('POST /company/[slug]/product', function () {
    before(function (done) {
        random = rand();
        userName = 'testes+' + random + '@empreendemia.com.br';
        
        // cria usuario
        api.post('auth', '/user', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Empresa ' + random,
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1
            }, function(error, data, response) {
                company = data;
                done();
            });
        });
    });
    
    it('token inválido', function(done) {
        api.post('companies', '/company/' + company.slug + '/product',
            {
                token : 'asdoewqoias1p234nioasfpn',
                name : 'Produto ' + random
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data.error, 'erro inexperado');
                    should.not.exist(data.slug, 'não é para gerar token');
                    done();
                }
            }
        );
    });
    it('dados obrigatórios não preenchidos', function(done) {
        api.post('companies', '/company/' + company.slug + '/product',
            {
                token : token
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data.error, 'erro inexperado');
                    should.not.exist(data.slug, 'não é para gerar token');
                    done();
                }
            }
        );
    });
    it('cadastra produto', function(done) {
        api.post('companies', '/company/' + company.slug + '/product',
            {
                token : token,
                name : 'Produto ' + random
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inexperado');
                    should.exist(data.slug, 'não gerou slug corretamente');
                    product = data;
                    done();
                }
            }
        );
    });
});