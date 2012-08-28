/** Tests Location.City
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller City do serviço Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('GET /country/slug-8c31070edf/state/slug-eabc233c52/cities', function () {
    before(function (done) {
        done();
    });
    
    it('lista de cidades', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities',
            null,
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(10);
                    done();
                }
            }
        );
    });
    it('estado que não existe', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/asdasdasdadeada/cities',
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
    it('pa�s que não existe', function(done) {
        api.get('location', '/country/asdasdqqewasdasdasd/state/slug-eabc233c52/cities',
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
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(18);
                    done();
                }
            }
        );
    });
    it('tenta listar mais de 20 cidades', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities',
            {
                limit : 25
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(21);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error);
                    var cities = data;
                    api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
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
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].name.should.be.above(data[i].name, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/cities',
            {
                order: {'slug': -1}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].slug.should.be.above(data[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
});

describe('GET /country/slug-8c31070edf/state/slug-eabc233c52/city/:city_id', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/city/awoineaiionsndoinsdoisa',
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
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/city/awoineaiionsndoinsdoisa',
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
        api.get('location', '/country/slug-8c31070edf/state/asdasdasdadeada/city/slug-01a03345ab',
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
    it('pa�s que não existe', function(done) {
        api.get('location', '/country/asdasdqqewasdasdasd/state/slug-eabc233c52/city/slug-01a03345ab',
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
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/city/503b7c247dd8ba7914000157',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7c247dd8ba7914000157', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-01a03345ab', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega cidade por slug', function(done) {
        api.get('location', '/country/slug-8c31070edf/state/slug-eabc233c52/city/slug-01a03345ab',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7c247dd8ba7914000157', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-01a03345ab', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});