/** Tests Location.Country
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Country do serviço Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('GET /countries', function () {
    before(function (done) {
        done();
    });
    
    it('lista de pa�ses', function(done) {
        api.get('location', '/countries',
            null,
            function(error, data, response) {

                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(11);
                    done();
                }
            }
        );
    });
    it('lista de 18 pa�ses', function(done) {
        api.get('location', '/countries',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.below(19);
                    done();
                }
            }
        );
    });
    it('tenta listar mais de 20 pa�ses', function(done) {
        api.get('location', '/countries',
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
        api.get('location', '/countries', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error);
                    var countries = data;
                    api.get('location', '/countries', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                JSON.stringify(countries)
                                    .should.include(JSON.stringify(data[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(countries)
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
        api.get('location', '/countries',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.length.should.be.above(2);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].name.should.be.above(data[i].name, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('location', '/countries',
            {
                order: {'slug': -1}
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
});

describe('GET /countries/:slug_country', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/countries/slug-8c31070edf',
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
    it('pa�s que não existe', function(done) {
        api.get('location', '/countries/slug-8c31070edf',
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
    it('pega pa�s por id', function(done) {
        api.get('location', '/countries/503b7c227dd8ba7914000011',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7c227dd8ba7914000011', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-8c31070edf', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega pa�s por slug', function(done) {
        api.get('location', '/countries/slug-8c31070edf',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7c227dd8ba7914000011', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-8c31070edf', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});