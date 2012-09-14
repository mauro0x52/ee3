/** Tests Location.Region
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Region do servi√ßo Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    dt = require("./Utils.js");

describe('GET /regions', function () {
    before(function (done) {
        done();
    });

    it('lista de regiões', function(done) {
        api.get('location', '/regions',
            null,
            function(error, data, response) {

                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.not.exist(data.error, 'erro inesperado');
                    data.regions.length.should.be.below(11);
                    done();
                }
            }
        );
    });
    it('lista de 18 regiões', function(done) {
        api.get('location', '/regions',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.regions.length.should.be.below(19);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('location', '/regions', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.regions.length.should.be.below(5);
                    var regions = data.regions;
                    if (data.regions.length == 4){
	                    api.get('location', '/regions', {limit : 2, page : 2}, function(error, data, response) {
	                            if (error) return done(error);
	                            else {
	                                should.not.exist(data.error, 'erro inesperado');
	                                data.regions.length.should.be.below(3);
	                                JSON.stringify(regions)
	                                    .should.include(JSON.stringify(data.regions[0]), 'resultado menor tem que está dentro do resultado maior');
	                                JSON.stringify(regions)
	                                    .should.include(JSON.stringify(data.regions[1]), 'resultado menor tem que está dentro do resultado maior');
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
        api.get('location', '/regions',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.not.exist(data.error, 'erro inesperado');
                    data.regions.length.should.be.below(11);
                    for (var i = 1; i < data.regions.length; i++) {
                        data[i].name.should.be.above(data.regions[i-1].name, 'não ordenou');
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
                    data.regions.length.should.be.below(11);
                    for (var i = 1; i < data.regions.length; i++) {
                        data.regions[i-1].slug.should.be.above(data.regions[i].slug, 'n√£o ordenou');
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
        api.get('location', '/region/'+dt.region.id,
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
    it('região que não existe', function(done) {
        api.get('location', '/region/awoineaiionsndoinsdoisa',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error').property('name', 'NotFoundError');
                    done();
                }
            }
        );
    });
    it('pega região por id', function(done) {
        api.get('location', '/region/'+dt.region.id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('region').have.property('_id', dt.region.id, 'os ids devem ser iguais');
                    data.should.have.property('region').have.property('slug', dt.region.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega região por slug', function(done) {
        api.get('location', '/region/'+dt.region.id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('region').have.property('_id', dt.region.id, 'os ids devem ser iguais');
                    data.should.have.property('region').have.property('slug', dt.region.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});