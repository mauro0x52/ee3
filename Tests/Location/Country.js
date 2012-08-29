/** Tests Location.Country
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Country do servi√ßo Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    dt = require("./Utils.js");

describe('GET /countries', function () {
    before(function (done) {
        done();
    });
    
    it('lista de países', function(done) {
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
    it('lista de 18 países', function(done) {
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
    it('tenta listar mais de 20 países', function(done) {
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
                    data.length.should.be.below(5);
                    var countries = data;
                    if (data.length == 4){
	                    api.get('location', '/countries', {limit : 2, page : 2}, function(error, data, response) {
	                            if (error) return done(error);
	                            else {
	                                should.not.exist(data.error, 'erro inesperado');
	                                data.length.should.be.below(3);
	                                JSON.stringify(countries)
	                                    .should.include(JSON.stringify(data[0]), 'resultado menor tem que est√° dentro do resultado maior');
	                                JSON.stringify(countries)
	                                    .should.include(JSON.stringify(data[1]), 'resultado menor tem que est√° dentro do resultado maior');
	                                done();
	                            }
	                        }
	                    );
                    } else {
	                    done();
                    }
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
                    data.length.should.be.below(11);
                    for (var i = 1; i < data.length; i++) {
                        data[i].name.should.be.above(data[i-1].name, 'n√£o ordenou');
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
                    data.length.should.be.below(11);
                    for (var i = 1; i < data.length; i++) {
                        data[i-1].slug.should.be.above(data[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
});

describe('GET /country/:slug_country', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/country/'+dt.country.slug,
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
    it('país que não existe', function(done) {
        api.get('location', '/country/asdasdasdasd',
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
    it('pega país por id', function(done) {
        api.get('location', '/country/'+dt.country.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', dt.country.id, 'os ids devem ser iguais');
                    data.should.have.property('slug', dt.country.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega país por slug', function(done) {
        api.get('location', '/country/'+dt.country.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('_id', dt.country.id, 'os ids devem ser iguais');
                    data.should.have.property('slug', dt.country.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});