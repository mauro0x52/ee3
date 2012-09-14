/** Tests Location.City
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller City do servi√ßo Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    dt = require("./Utils.js");


describe('GET /country/[slugCountry]/state/[slugState]/cities', function () {
    before(function (done) {
        done();
    });

    it('lista de cidades', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities',
            null,
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.cities.length.should.be.above(100);
                    for (var i = 1; i < data.cities.length; i++) {
                        data.cities[i].should.have.property('name');
                        data.cities[i].name.should.be.above(data.cities[i-1].name, 'não ordenou');
                        data.cities[i].should.have.property('state').equal(dt.state.id);
                    }
                    done();
                }
            }
        );
    });
    it('estado que não existe', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/asdasdadsasdasds/cities',
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
    it('paÌs que não existe', function(done) {
        api.get('location', '/country/asdasdasdasdasdad/state/'+dt.state.slug+'/cities',
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
    it('lista de 18 cidades', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.cities.should.have.lengthOf(18);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.cities.should.have.lengthOf(4);
                    var cities = data.cities;
                    api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                data.cities.should.have.lengthOf(2);
                                JSON.stringify(cities)
                                    .should.include(JSON.stringify(data.cities[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(cities)
                                    .should.include(JSON.stringify(data.cities[1]), 'resultado menor tem que está dentro do resultado maior');
                                done();
                            }
                        }
                    );
                }
            }
        );
    });
    it('ordenação padrão (name ascending)', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.cities.length.should.be.above(100);
                    for (var i = 1; i < data.length; i++) {
                        data.cities[i].name.should.be.above(data.cities[i-1].name, 'não ordenou');
                        data.cities[i].should.have.property('state').equal(dt.state.id);
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities',
            {
                order: {'slug': -1}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.cities.length.should.be.above(100);
                    for (var i = 1; i < data.cities.length; i++) {
                        data.cities[i-1].slug.should.be.above(data.cities[i].slug, 'não ordenou');
                        data.cities[i].should.have.property('state').equal(dt.state.id);
                    }
                    done();
                }
            }
        );
    });
});

describe('GET /country/[slugCountry]/state/[slugState]/city/[slugCity]', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/city/'+dt.city.slug,
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
    it('cidade que não existe', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/city/awoineaiionsndoinsdoisa',
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
    it('estado que não existe', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/asdasdasdasd/city/'+dt.city.slug,
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
    it('país que não existe', function(done) {
        api.get('location', '/country/asdasdasdasdaasd/state/'+dt.state.slug+'/city/'+dt.city.slug,
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
    it('pega cidade por id', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/city/'+dt.city.id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('city').have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('city').have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega cidade por slug', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/city/'+dt.city.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('city').have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('city').have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega cidade por id de estado', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.id+'/city/'+dt.city.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('city').have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('city').have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega cidade por id de país', function(done) {
        api.get('location', '/country/'+dt.country.id+'/state/'+dt.state.id+'/city/'+dt.city.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('city').have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('city').have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});

describe('GET /city/[idCity]', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/city/'+dt.city.id,
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
    it('pega cidade por id', function(done) {
        api.get('location', '/city/'+dt.city.id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('city').have.property('slug').equal(dt.city.slug);
                    data.should.have.property('state').have.property('slug').equal(dt.state.slug);
                    done();
                }
            }
        );
    });
});