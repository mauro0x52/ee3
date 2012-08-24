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
    random,
    token, company, product,
    token2, company2;

random = rand();
user = {username : 'testes+' + random + '@empreendemia.com.br'};

describe('POST /company/[slug]/product', function () {
    before(function (done) {

        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
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
                    should.exist(data);
                    data.should.have.property('error');
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
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('cadastra produto', function(done) {
        api.post('companies', '/company/' + company.slug + '/product',
            {
                token : token,
                name : '   Produto muito     bonitão! ' + random
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('slug').equal('produto-muito-bonitao-' + random);
                    data.should.have.property('name').equal('Produto muito bonitão! ' + random);
                    product = data;
                    done();
                }
            }
        );
    });
    it('cadastra produto com mesmo nome', function(done) {
        api.post('companies', '/company/' + company.slug + '/product',
            {
                token : token,
                name : '   Produto muito     bonitão! ' + random
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('slug')
                        .match(/[a-z,0-9,\-]+\-[0-9,a-f]{2}/)
                        .not.equal(product.slug);
                    done();
                }
            }
        );
    });
});