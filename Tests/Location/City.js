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
                    data.length.should.be.above(100);
                    for (var i = 1; i < data.length; i++) {
                        data[i].should.have.property('name');
                        data[i].name.should.be.above(data[i-1].name, 'não ordenou');
                        data[i].should.have.property('state').equal(dt.state.id);
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
                    should.exist(data.error);
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
                    should.exist(data.error);
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
                    data.should.have.lengthOf(18);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error);
                    data.should.have.lengthOf(4);
                    var cities = data;
                    api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug+'/cities', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                data.should.have.lengthOf(2);
                                JSON.stringify(cities)
                                    .should.include(JSON.stringify(data[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(cities)
                                    .should.include(JSON.stringify(data[1]), 'resultado menor tem que está dentro do resultado maior');
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
                    data.length.should.be.above(100);
                    for (var i = 1; i < data.length; i++) {
                        data[i].name.should.be.above(data[i-1].name, 'não ordenou');
                        data[i].should.have.property('state').equal(dt.state.id);
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
                    data.length.should.be.above(100);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].slug.should.be.above(data[i].slug, 'não ordenou');
                        data[i].should.have.property('state').equal(dt.state.id);
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
                    should.exist(data.error);
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
                    should.exist(data.error);
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
                    should.exist(data.error);
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
                    data.should.have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
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
                    data.should.have.property('_id', dt.city.id, 'os ids devem ser iguais');
                    data.should.have.property('slug', dt.city.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});