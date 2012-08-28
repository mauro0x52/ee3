/** Tests Location.Region
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Region do serviço Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('GET /regions', function () {
    before(function (done) {
        done();
    });
    
    it('lista de regi�es', function(done) {
        api.get('location', '/regions',
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
    it('lista de 18 regi�es', function(done) {
        api.get('location', '/regions',
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
    it('tenta listar mais de 20 regi�es', function(done) {
        api.get('location', '/regions',
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
        api.get('location', '/regions', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error);
                    var regions = data;
                    api.get('location', '/regions', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                should.not.exist(data.error, 'erro inesperado');
                                JSON.stringify(regions)
                                    .should.include(JSON.stringify(data[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(regions)
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
        api.get('location', '/regions',
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
        api.get('location', '/regions',
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

describe('GET /region/:region_id', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/region/awoineaiionsndoinsdoisa',
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
    it('regãoi que não existe', function(done) {
        api.get('location', '/region/awoineaiionsndoinsdoisa',
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
    it('pega regi�o por id', function(done) {
        api.get('location', '/region/503b7d9a73ab698114000001',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7d9a73ab698114000001', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-a752c3e488', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega regi�o por slug', function(done) {
        api.get('location', '/region/slug-a752c3e488',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', '503b7d9a73ab698114000001', 'os ids devem ser iguais');
                    data.should.have.property('slug', 'slug-a752c3e488', 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});