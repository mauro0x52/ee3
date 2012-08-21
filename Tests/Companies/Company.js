/** Tests Companies.Company
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Company do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    token, company, companyName, companySlug,
    token2, company2, companyName2, companySlug2,
    city;

random = rand();
userName = 'testes+' + random + '@empreendemia.com.br';
companyName = 'Empresa ' + random;


describe('POST /company', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : userName,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            done();
        });
    });


    it('url existe', function(done) {
        api.post('companies', '/company', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                response.should.have.status(200);
                done();
            }
        });
    });
    it('dados obrigatórios não preenchidos', function(done) {
        api.post('companies', '/company', {
            token : token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.slug);
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.post('companies', '/company', {
            token : 'arbufudbcu1b3124913r987bass978a',
            name : companyName,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'both',
            active : 1
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.error);
                should.not.exist(data.slug);
                done();
            }
        });
    });
    it('cadastra empresa', function(done) {
        api.post('companies', '/company', {
            token : token,
            name : companyName,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'both',
            active : 1,
            about: 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.slug, 'nao gerou slug corretamente');
                should.not.exist(data.error, 'erro inesperado');
                company = data;
                done();
            }
        });
    });
    it('cadastro com mesmo nome', function(done) {
        api.post('companies', '/company', {
            token : token,
            name : companyName,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'both',
            active : 1,
            about: 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(data.slug, 'nao gerou slug corretamente');
                should.not.exist(data.error, 'erro inesperado');
                (company.slug ? company.slug : '').should.not.equal(data.slug, 'slugs repetidos');
                company = data;
                done();
            }
        });
    });
});


describe('GET /companies', function () {
    before(function (done) {
        // cria 10 empresas
        var countCompanies = 0;
        for (var i = 0; i < 20; i++) {
            api.post('auth', '/user', {
                username : 'testes+b'+rand()+'@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
            }, function(error, data) {
                api.post('companies', '/company', {
                    token : data.token,
                    name : 'Empresa b'+rand(),
                    activity : 'consultoria em testes',
                    sectors : [1+Math.floor((Math.random()*2)), 3 + Math.floor((Math.random()*2))],
                    type : 'company',
                    profile : 'both',
                    active : 1,
                    about: 'sobre'
                }, function(error, data, response) {
                    countCompanies++;
                    if (countCompanies == 15) {
                        done();
                    }
                });
            });
        }
    });

    it('lista de empresas', function(done) {
        api.get('companies', '/companies',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.lengthOf(10);
                    done();
                }
            }
        );
    });
    it('lista de 18 empresas', function(done) {
        api.get('companies', '/companies',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.lengthOf(18);
                    done();
                }
            }
        );
    });
    it('tenta listar mais de 20 empresas', function(done) {
        api.get('companies', '/companies',
            {
                limit : 25
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.lengthOf(20);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('companies', '/companies', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error);
                    var companies = data;
                    api.get('companies', '/companies', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data[1]), 'resultado menor tem que está dentro do resultado maior');
                                done();
                            }
                        }
                    );
                }
            }
        );
    });
    it('ordenação padrão (dateCreated descending)', function(done) {
        api.get('companies', '/companies',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].dateCreated.should.be.above(data[i].dateCreated, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('companies', '/companies',
            {
                order: ['slug', -1]
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].slug.should.be.above(data[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por atividade e depois slug', function(done) {
        api.get('companies', '/companies',
            {
                order: ['activity', -1, 'slug', -1]
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].slug.should.be.above(data[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por setor', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : 1,
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i].sectors.should.include(1, 'não filtrou por setor');
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por vários setores (AND)', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : [1, 3],
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i].sectors.should.include(1, 'não filtrou por setor');
                        data[i].sectors.should.include(3, 'não filtrou por setor');
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por vários setores (OR)', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : [1, 3],
                filterBySectorsOperator : 'or',
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    var validate = true;
                    for (var i = 1; i < data.length; i++) {
                        if (data[i].sectors.indexOf(1) < 0 && data[i].sectors.indexOf(3) < 0) {
                            validate = false;
                        }
                        validate.should.be.ok;
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por cidade', function(done) {
    });
    it('filtrar por cidades', function(done) {
    });
});

describe('GET /company', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('companies', '/company/awoineaiionsndoinsdoisa',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    done();
                }
            }
        );
    });

    it('empresa que não existe', function(done) {
        api.get('companies', '/company/awoineaiionsndoinsdoisa',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('pega empresa por id', function(done) {
        api.get('companies', '/company/' + company._id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', company._id, 'os ids devem ser iguais');
                    data.should.have.property('slug', company.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega empresa por slug', function(done) {
        api.get('companies', '/company/' + company.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', company._id, 'os ids devem ser iguais');
                    data.should.have.property('slug', company.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('empresa sem setar atributos', function(done) {
        api.get('companies', '/company/' + company._id,
            {
                attributes : {
                    products : false,
                    about : false
                }
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.products, 'não deve mostrar produtos');
                    should.not.exist(data.addresses, 'não deve mostrar endereços');
                    should.not.exist(data.about, 'não deve mostrar sobre');
                    should.not.exist(data.embeddeds, 'não deve mostrar embeddeds');
                    should.not.exist(data.phones, 'não deve mostrar telefones');
                    should.not.exist(data.links, 'não deve mostrar links');
                    done();
                }
            }
        );
    });
    it('empresa com atributos logado', function(done) {
        api.get('companies', '/company/' + company._id,
            {
                token : token,
                attributes : [
                    'products',
                    'addresses',
                    'phones',
                    'about',
                    'embeddeds',
                    'phones',
                    'links'
                ]
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    should.exist(data.about, 'deve mostrar sobre');
                    should.exist(data.products, 'deve mostrar produtos');
                    should.exist(data.addresses, 'deve mostrar endereços');
                    should.exist(data.embeddeds, 'deve mostrar embeddeds');
                    should.exist(data.phones, 'deve mostrar telefones');
                    should.exist(data.links, 'deve mostrar links');
                    done();
                }
            }
        );
    });
    it('empresa com telefone deslogado', function(done) {
        api.get('companies', '/company/' + company._id,
            {
                attributes : [
                    'addresses',
                    'phones',
                    'contacts'
                ]
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    should.not.exist(data.addresses, 'não deve mostrar endereços');
                    should.not.exist(data.phones, 'não deve mostrar telefones');
                    should.not.exist(data.contacts, 'não deve mostrar contatos');
                    done();
                }
            }
        );
    });
});