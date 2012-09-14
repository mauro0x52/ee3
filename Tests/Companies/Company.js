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
    ObjectId = require('mongodb').BSONPure.ObjectID,
    user, company, user2,
    city;

random = rand();
user = { username : 'testes+' + random + '@empreendemia.com.br'};
user2 = { username : 'testes+' + random + '2@empreendemia.com.br'};


describe('POST /company', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user = data.user;
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
            token : user.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.post('companies', '/company', {
            token : 'arbufudbcu1b3124913r987bass978a',
            name : 'Emprêsa   muito bacanão! ' + random,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'all',
            active : 1
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('cadastra empresa', function(done) {
        api.post('companies', '/company', {
            token : user.token,
            name : '   Emprêsa   muito bacanão!   ' + random,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'all',
            active : 1,
            addresses : [{street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000001',headQuarters:true}, {street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000002',headQuarters:true}],
            about: 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('company').have.property('slug').match(/[a-z,0-9,\-]+/);
                data.should.have.property('company').have.property('name').equal('Emprêsa muito bacanão! ' + random);
                company = data.company;
                done();
            }
        });
    });
    it('cadastro com mesmo nome', function(done) {
        api.post('companies', '/company', {
            token : user.token,
            name : '   Emprêsa   muito bacanão!   ' + random,
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'all',
            active : 1,
            about: 'sobre',
            addresses : [{street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000001',headQuarters:true}, {street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000002',headQuarters:true}]
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('company').have.property('slug').not.equal(company.slug);
                data.should.have.property('company').have.property('slug').match(/[a-z,0-9,\-]+\-[0-9,a-f]{2,}/);
                company = data.company;
                done();
            }
        });
    });
    it('cadastro com nome escroto', function(done) {
        api.post('companies', '/company', {
            token : user.token,
            name : '   Êmpresa com n0me muit@ escroto   !    ' + rand(),
            activity : 'consultoria em testes',
            type : 'company',
            profile : 'all',
            active : 1,
            about: 'sobre',
            addresses : [{street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000001',headQuarters:true}, {street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000002',headQuarters:true}]
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('company').not.have.property('error');
                data.should.have.property('company').have.property('slug').match(/[a-z,0-9,\-]+/);
                company = data.company;
                done();
            }
        });
    });
});


describe('GET /companies', function () {
    before(function (done) {
        // cria várias empresas
        var countCompanies = 0;
        for (var i = 0; i < 20; i++) {
            api.post('auth', '/user', {
                username : 'testes+b'+rand()+'@empreendemia.com.br',
                password : 'testando',
                password_confirmation : 'testando'
            }, function(error, data) {
                var user = data.user;
                api.post('companies', '/company', {
                    token : user.token,
                    name : 'Váreas empresa bacana!' + rand(),
                    activity : 'consultoria em testes',
                    sectors : ['00000000000000000000000'+(1+Math.floor((Math.random()*2))), '00000000000000000000000'+(3 + Math.floor((Math.random()*2)))],
                    type : 'company',
                    profile : 'all',
                    active : 1,
                    about: 'sobre',
                    addresses : [{street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000000',headQuarters:true}, {street:'nome da rua',number:294,complement:'complemento',city:'000000000000000000000002',headQuarters:true}]
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
            null,
            function(error, data, response) {

                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.should.have.lengthOf(10);
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
                    data.companies.should.have.lengthOf(18);
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
                    data.companies.should.have.lengthOf(20);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('companies', '/companies', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    var companies = data.companies;
                    api.get('companies', '/companies', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data.companies[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data.companies[1]), 'resultado menor tem que está dentro do resultado maior');
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
                    data.companies.length.should.be.above(2);
                    for (var i = 1; i < data.companies.length; i++) {
                        data.companies[i-1].dateCreated.should.be.above(data.companies[i].dateCreated, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('companies', '/companies',
            {
                order: {'slug': -1}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(2);
                    for (var i = 1; i < data.companies.length; i++) {
                        data.companies[i-1].slug.should.be.above(data.companies[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por atividade e depois slug', function(done) {
        api.get('companies', '/companies',
            {
                order: [{'activity': -1}, {'slug': -1}]
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(2);
                    for (var i = 1; i < data.companies.length; i++) {
                        data.companies[i-1].activity.should.not.be.below(data.companies[i].activity, 'não ordenou');
                        if (data.companies[i-1].activity <= data.companies[i].activity) {
                            data.companies[i-1].slug.should.not.be.below(data.companies[i].slug, 'não ordenou');
                        }
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por setor', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : {sectors:['000000000000000000000001']},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(2);
                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].sectors.should.include('000000000000000000000001', 'não filtrou por setor');
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por vários setores (AND)', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003']},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(2);
                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].sectors.should.include('000000000000000000000001', 'não filtrou por setor');
                        data.companies[i].sectors.should.include('000000000000000000000003', 'não filtrou por setor');
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por vários setores (OR)', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003'], operator : 'or'},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(2);
                    var validate = true;
                    for (var i = 0; i < data.companies.length; i++) {
                        if (data.companies[i].sectors.indexOf('000000000000000000000001') < 0 && data.companies[i].sectors.indexOf('000000000000000000000003') < 0) {
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
        api.get('companies', '/companies',
            {
                filterByCities : {cities:['000000000000000000000001']},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(1);
                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].should.have.property('addresses');

                        var localvalidate = false;
                        for (var j = 0; j < data.companies[i].addresses.length; j++) {
                            if (data.companies[i].addresses[j].city === '000000000000000000000001') {
                                localvalidate = true;
                            }
                        }
                        localvalidate.should.be.ok;
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por cidades (or)', function(done) {
        api.get('companies', '/companies',
            {
                filterByCities : {cities:['000000000000000000000001','000000000000000000000002'], operator:'or'},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(1);
                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].should.have.property('addresses');
                        var foundOne = false;
                        var foundTwo = false;
                        for (var j = 0; j < data.companies[i].addresses.length; j++) {
                            if (data.companies[i].addresses[j].city === '000000000000000000000001') {
                                foundOne = true;
                            } else if (data.companies[i].addresses[j].city === '000000000000000000000002') {
                                foundTwo = true;
                            }
                        }
                        (foundOne || foundTwo).should.be.ok;
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por cidades (and)', function(done) {
        api.get('companies', '/companies',
            {
                filterByCities : {cities:['000000000000000000000001','000000000000000000000002'], operator:'and'},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(1);
                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].should.have.property('addresses');
                        var foundOne = false;
                        var foundTwo = false;
                        for (var j = 0; j < data.companies[i].addresses.length; j++) {
                            if (data.companies[i].addresses[j].city === '000000000000000000000001') {
                                foundOne = true;
                            } else if (data.companies[i].addresses[j].city === '000000000000000000000002') {
                                foundTwo = true;
                            }
                        }
                        (foundOne && foundTwo).should.be.ok;
                    }
                    done();
                }
            }
        );
    });
    it('filtrar por setores (and) e cidades (or) com paginação', function(done) {
        api.get('companies', '/companies',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003'], operator : 'and'},
                filterByCities : {cities : ['000000000000000000000001','000000000000000000000002'], operator:'or'},
                limit : 20
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.companies.length.should.be.above(1);

                    for (var i = 0; i < data.companies.length; i++) {
                        data.companies[i].should.have.property('sectors');
                        data.companies[i].sectors.should.include('000000000000000000000001', 'não filtrou por setor');
                        data.companies[i].sectors.should.include('000000000000000000000003', 'não filtrou por setor');

                        data.companies[i].should.have.property('addresses');
                        var foundCityOne = false;
                        var foundCityTwo = false;
                        for (var j = 0; j < data.companies[i].addresses.length; j++) {
                            if (data.companies[i].addresses[j].city === '000000000000000000000001') {
                                foundCityOne = true;
                            } else if (data.companies[i].addresses[j].city === '000000000000000000000002') {
                                foundCityTwo = true;
                            }
                        }
                        (foundCityOne || foundCityTwo).should.be.ok;
                    }
                    var companies = data.companies;
                    api.get('companies', '/companies',
                        {
                            filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003'], operator : 'and'},
                            filterByCities : {cities : ['000000000000000000000001','000000000000000000000002'], operator:'or'},
                            limit : 2,
                            page : 2
                        },
                        function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data.companies[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(companies)
                                    .should.include(JSON.stringify(data.companies[1]), 'resultado menor tem que está dentro do resultado maior');
                                done();
                            }
                        }
                    );
                }
            }
        );
    });
});


describe('GET /companies/count', function () {

    it('conta todas empresas', function(done) {
        api.get('companies', '/companies/count', null, function(error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                should.exist(data);
                data.should.not.have.property('error');
                data.should.have.property('count').above(1);
                db.openCollection('companies', 'companies', function(error, companies) {
                    companies.count(function (error, count) {
                        count.should.be.equal(data.count);
                        done();
                    })
                });
            }
        });
    });
    it('conta por setor', function(done) {
        api.get('companies', '/companies/count',
            {
                filterBySectors : {sectors:['000000000000000000000001']}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({sectors : {$all : [ObjectId('000000000000000000000001')]}}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por vários setores (AND)', function(done) {
        api.get('companies', '/companies/count',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003']}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({sectors : {$all : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000003')]}}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por vários setores (OR)', function(done) {
        api.get('companies', '/companies/count',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003'], operator : 'or'}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({sectors : {$in : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000003')]}}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por cidade', function(done) {
        api.get('companies', '/companies/count',
            {
                filterByCities : {cities:['000000000000000000000001']}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({'addresses.city' : { $in : [ObjectId('000000000000000000000001')] }}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por cidades (or)', function(done) {
        api.get('companies', '/companies/count',
            {
                filterByCities : {cities:['000000000000000000000001','000000000000000000000002'], operator:'or'}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({'addresses.city' : { $in : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000002')] }}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por cidades (and)', function(done) {
        api.get('companies', '/companies/count',
            {
                filterByCities : {cities:['000000000000000000000001','000000000000000000000002'], operator:'and'}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({'addresses.city' : { $all : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000002')] }}, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
    it('conta por setores (and) e cidades (or) com paginação', function(done) {
        api.get('companies', '/companies/count',
            {
                filterBySectors : {sectors : ['000000000000000000000001', '000000000000000000000003'], operator : 'and'},
                filterByCities : {cities : ['000000000000000000000001','000000000000000000000002'], operator:'or'}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('count').above(1);
                    db.openCollection('companies', 'companies', function(error, companies) {
                        companies.count({
                            'sectors' : { $all : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000003')] },
                            'addresses.city' : { $in : [ObjectId('000000000000000000000001'),ObjectId('000000000000000000000002')] }
                        }, function (error, count) {
                            if (error) done(error);
                            else {
                                count.should.be.equal(data.count);
                                done();
                            }
                        })
                    });
                }
            }
        );
    });
});

describe('GET /company/:company_id', function () {
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
                    data.should.have.property('error');
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
                    data.should.have.property('company').have.property('_id', company._id, 'os ids devem ser iguais');
                    data.should.have.property('company').have.property('slug', company.slug, 'os slugs devem ser iguais');
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
                    data.should.have.property('company').have.property('_id', company._id, 'os ids devem ser iguais');
                    data.should.have.property('company').have.property('slug', company.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('empresa sem setar atributos', function(done) {
        api.get('companies', '/company/' + company._id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.products, 'não deve mostrar produtos');
                    data.should.have.property('company').have.property('addresses').not.have.property('street');
                    data.should.have.property('company').have.property('addresses').not.have.property('number');
                    data.should.have.property('company').have.property('addresses').not.have.property('complement');
                    should.not.exist(data.company.about, 'não deve mostrar sobre');
                    should.not.exist(data.company.embeddeds, 'não deve mostrar embeddeds');
                    should.not.exist(data.company.phones, 'não deve mostrar telefones');
                    should.not.exist(data.company.links, 'não deve mostrar links');
                    done();
                }
            }
        );
    });
    it('empresa com atributos logado', function(done) {
        api.get('companies', '/company/' + company._id,
            {
                token : user.token,
                attributes : {
                    products : true,
                    addresses : true,
                    phones : true,
                    about : true,
                    embeddeds : true,
                    phones : true,
                    links : true
                }
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('company').not.property('error');
                    data.should.have.property('company').property('about');
                    data.should.have.property('company').property('products');
                    data.should.have.property('company').property('addresses');
                    data.should.have.property('company').property('embeddeds');
                    data.should.have.property('company').property('phones');
                    data.should.have.property('company').property('links');
                    done();
                }
            }
        );
    });
    it('empresa com atributos deslogado', function(done) {
        api.get('companies', '/company/' + company._id,
            {
                attributes : {
                    addresses : true,
                    phones : true,
                    contacts : true
                }
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('company').have.property('addresses').have.not.property('street');
                    data.should.have.property('company').have.property('addresses').have.not.property('number');
                    data.should.have.property('company').have.property('addresses').have.not.property('complement');
                    data.should.have.property('company').not.have.property('phones');
                    data.should.have.property('company').not.have.property('contacts');
                    done();
                }
            }
        );
    });
});

describe('PUT /company/:company:id', function(error, data){

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : user2.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user2 = data.user;
            done();
        });
    });

    it('empresa não existe', function(done) {
        api.put('companies', '/company/asndosaindsa', {}, function (error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.put('companies', '/company/'+company.slug, {
            token : 'aeoibs09d8a98s',
            name : 'Outro nome muuuito bacana '+random
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('tenta setar um campo obrigatório como nulo', function(done) {
        api.put('companies', '/company/'+company.slug, {
            token : user.token,
            name : null
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('muda o nome da empresa', function(done) {
        api.put('companies', '/company/'+company.slug, {
            token : user.token,
            name : 'Outro nome muuuito bacana '+random
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('company').have.property('_id').equal(company._id);
                data.should.have.property('company').have.property('slug').not.equal(company.slug);
                data.should.have.property('company').have.property('name').equal('Outro nome muuuito bacana '+random);
                data.should.have.property('company').have.property('activity').equal(company.activity);
                data.should.have.property('company').have.property('about').equal(company.about);
                data.should.have.property('company').have.property('dateUpdated').above(company.dateUpdated);
                company = data.company;
                db.openCollection('companies', 'companies', function(error, companies) {
                    companies.findOne({slug : company.slug }, function (error, dbcompany) {
                        if (error) done (error);
                        else {
                            dbcompany.should.have.property('_id')
                            dbcompany.should.have.property('slug').equal(company.slug);
                            dbcompany.should.have.property('name').equal(company.name);
                            dbcompany.should.have.property('about').equal(company.about);
                            done();
                        }
                    })
                });
            }
        });
    });
    it('outro nome, mesmo slug', function(done) {
        api.put('companies', '/company/'+company.slug, {
            token : user.token,
            name : 'Ou#$%tro!$ n&$omE mUUUito bacana!!!!!!@$#%* '+random
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('company').have.property('_id').equal(company._id);
                data.should.have.property('company').have.property('slug').equal(company.slug);
                company = data.company;
                db.openCollection('companies', 'companies', function(error, companies) {
                    companies.findOne({slug : company.slug }, function (error, dbcompany) {
                        if (error) done (error);
                        else {
                            dbcompany.should.have.property('slug').equal(company.slug);
                            dbcompany.should.have.property('name').equal(company.name);
                            done();
                        }
                    })
                });
            }
        });
    });
    it('empresa criada por outro usuário', function(done) {
        api.put('companies', '/company/'+company.slug, {
            token : user2.token,
            name : 'Ou#$%tro!$ n&$omE mUUUito bacana!!!!!!@$#%* '+random
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
});

describe('DEL /company/:company_id', function(error, data){
    it('empresa não existe', function(done) {
        api.del('companies', '/company/asndosaindsa', {}, function (error, data, response) {
            if (error) done(error);
            else {
                response.should.have.status(200);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('token invalido', function(done) {
        api.del('companies', '/company/'+company.slug, {
            token: 'aosndoinwe'
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa criada por outro usuário', function(done) {
        api.del('companies', '/company/'+company.slug, {
            token : user2.token
        }, function (error, data, response) {
            if (error) done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('apaga', function(done) {
        api.del('companies', '/company/'+company.slug, {
            token : user.token
        }, function (error, data, response) {
            if (error) done(error);
            else {
                should.not.exist(data);
                db.openCollection('companies', 'companies', function(error, companies) {
                    companies.count({slug : company.slug }, function (error, count) {
                        if (error) done (error);
                        else {
                            count.should.be.equal(0);
                            done();
                        }
                    })
                });
            }
        });
    });
});
