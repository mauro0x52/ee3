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
    company, product,
    company2;

random = rand();
user = {username : 'testes+' + random + '@empreendemia.com.br'};
user2 = {username : 'testes+' + random + '2@empreendemia.com.br'};

describe('POST /company/[slug]/product', function () {
    before(function (done) {

        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user.token = data.token;
            api.post('companies', '/company', {
                token : user.token,
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
                token : user.token
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
                token : user.token,
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
                token : user.token,
                name : '   Produto muito     bonitão! ' + random
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('slug')
                        .match(/[a-z,0-9,\-]+\-[0-9,a-f]{2,}/)
                        .not.equal(product.slug);
                    done();
                }
            }
        );
    });
});

describe('GET /company/:company_id/products', function() {
    before(function (done) {
        // cria vários produtos
        var countProducts = 0;
        var createCompany = false;
        for (var i = 0; i < 15; i++) {
            api.post('companies', '/company/'+company.slug+'/product', {
                token : user.token,
                name : 'Váreos produto bacana!' + rand()
            }, function(error, data, response) {
                countProducts++;
                if (countProducts == 10 && createCompany) {
                    done();
                }
            });
        }

        // cria usuario
        api.post('auth', '/user', {
            username : user2.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user2.token = data.token;
            api.post('companies', '/company', {
                token : user2.token,
                name : 'Empresa 2 ' + random,
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1
            }, function(error, data, response) {
                company2 = data;
                createCompany = true;
                if (countProducts >= 10) {
                    done();
                }
            });
        });
    });

    it('empresa não encontrada', function(done) {
        api.get('companies', '/company/ds9fbv09ufasjewasd/products', {}, function (error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produtos', function(done) {
        api.get('companies', '/company/'+company2.slug+'/products', {}, function (error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('lista de produtos', function(done) {
        api.get('companies', '/company/'+company.slug+'/products', {}, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.length.should.be.above(5);
                for (var i = 0; i < data.length; i++) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('slug');
                    data[i].should.have.property('name');
                }
                done();
            }
        });
    });
});


describe('GET /company/:company_id/product/:product_id', function() {
    it('empresa não encontrada', function(done) {
        api.get('companies', '/company/ds9fbv09ufasjewasd/product/'+product.slug, {}, function (error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto de empresa sem produto', function(done) {
        api.get('companies', '/company/' + company2.slug + '/product/asdpnfsdb0vc9h23n4we', {}, function (error, data, response) {
            if (error) done(error);
            else {
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não encontrado', function(done) {
        api.get('companies', '/company/' + company.slug + '/product/asdpnfsdb0vc9h23n4we', {}, function (error, data, response) {
            if (error) done(error);
            else {
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto por slug', function(done) {
        api.get('companies', '/company/' + company.slug + '/product/' + product.slug, {}, function (error, data, response) {
            if (error) done(error);
            else {
                should.exist(data);
                data.should.not.have.property('error');
                data.should.have.property('_id').equal(product._id);
                data.should.have.property('slug').equal(product.slug);
                data.should.have.property('name').equal(product.name);
                done();
            }
        });
    });
    it('produto por id', function(done) {
        api.get('companies', '/company/' + company.slug + '/product/' + product._id, {}, function (error, data, response) {
            if (error) done(error);
            else {
                should.exist(data);
                data.should.not.have.property('error');
                data.should.have.property('_id').equal(product._id);
                data.should.have.property('slug').equal(product.slug);
                data.should.have.property('name').equal(product.name);
                done();
            }
        });
    });
});



describe('PUT /company/:company_id/product/:product_id', function() {
    it('token inválido', function(done) {
        api.put('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : 'fdg9nhoifkjnslkdnlksndfsdf'
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa não encontrada', function(done) {
        api.put('companies', '/company/adsf-g0hpotlmaçsldma/product/' + product.slug, {
            token : user.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não encontrado', function(done) {
        api.put('companies', '/company/' + company.slug + '/product/adiopbfngoib214o3i5b5osnbd', {
            token : user.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produto', function(done) {
        api.put('companies', '/company/' + company2.slug + '/product/adiopbfngoib214o3i5b5osnbd', {
            token : user2.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa de outro usuário', function(done) {
        api.put('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : user2.token,
            name : 'Vou mudar o nome de sacanagem'
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('mantem slug', function(done) {
        api.put('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : user.token,
            name : product.name + '!@$#%    '
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('_id').equal(product._id);
                data.should.have.property('slug').equal(product.slug);
                data.should.have.property('name').equal(product.name + '!@$#%');
                product = data;
                api.get('companies', '/company/' + company.slug + '/product/' + product.slug, {}, function (error, data, response) {
                    if (error) done(error);
                    else {
                        data.should.not.have.property('error');
                        data.should.have.property('_id').equal(product._id);
                        data.should.have.property('slug').equal(product.slug);
                        data.should.have.property('name').equal(product.name);
                        done();
                    }
                });
            }
        });
    });
    it('muda o nome', function(done) {
        api.put('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : user.token,
            name : 'Vou mudar o nome '+random
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('_id').equal(product._id);
                data.should.have.property('slug').equal('vou-mudar-o-nome-'+random);
                data.should.have.property('name').equal('Vou mudar o nome '+random);
                product = data;
                api.get('companies', '/company/' + company.slug + '/product/' + product.slug, {}, function (error, data, response) {
                    if (error) done(error);
                    else {
                        data.should.not.have.property('error');
                        data.should.have.property('_id').equal(product._id);
                        data.should.have.property('slug').equal('vou-mudar-o-nome-'+random);
                        data.should.have.property('name').equal('Vou mudar o nome '+random);
                        done();
                    }
                });
            }
        });
    });
});

describe('DEL /company/:company_id/product/:product_id', function() {
    it('token inválido', function(done) {
        api.del('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : 'fdg9nhoifkjnslkdnlksndfsdf'
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa não encontrada', function(done) {
        api.del('companies', '/company/adsf-g0hpotlmaçsldma/product/' + product.slug, {
            token : user.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não encontrado', function(done) {
        api.del('companies', '/company/' + company.slug + '/product/adiopbfngoib214o3i5b5osnbd', {
            token : user.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produto', function(done) {
        api.del('companies', '/company/' + company2.slug + '/product/adiopbfngoib214o3i5b5osnbd', {
            token : user2.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa de outro usuário', function(done) {
        api.del('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : user2.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('apaga produto', function(done) {
        api.del('companies', '/company/' + company.slug + '/product/' + product.slug, {
            token : user.token
        }, function(error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                api.get('companies', '/company/' + company.slug + '/product/' + product.slug, {}, function (error, data, response) {
                    if (error) done(error);
                    else {
                        data.should.have.property('error');
                        done();
                    }
                });
            }
        });
    });
});
