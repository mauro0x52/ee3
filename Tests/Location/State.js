/** Tests Location.State
 *
 * @autor : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Kit de testes do controller State do servi√ßo Location
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    dt = require("./Utils.js");

describe('GET /country/:slug_country/states', function () {
    before(function (done) {
        done();
    });

    it('lista de estados', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/states',
            null,
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    data.should.not.have.property('error');
                    data.states.should.have.lengthOf(27);
                    done();
                }
            }
        );
    });
    it('país que não existe', function(done) {
        api.get('location', '/country/asdasdqqewasdasdasd/states',
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
    it('lista de 18 estados', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/states',
            {
                limit : 18
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.states.should.have.lengthOf(18);
                    done();
                }
            }
        );
    });
    it('paginação', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/states', {limit : 4, page : 1}, function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.states.should.have.lengthOf(4);
                    var states = data.states;
                    api.get('location', '/country/'+dt.country.slug+'/states', {limit : 2, page : 2}, function(error, data, response) {
                            if (error) return done(error);
                            else {
                                data.should.not.have.property('error');
                                data.states.should.have.lengthOf(2);
                                JSON.stringify(states)
                                    .should.include(JSON.stringify(data.states[0]), 'resultado menor tem que está dentro do resultado maior');
                                JSON.stringify(states)
                                    .should.include(JSON.stringify(data.states[1]), 'resultado menor tem que está dentro do resultado maior');
                                done();
                            }
                        }
                    );
                }
            }
        );
    });
    it('ordenação padrão (name ascending)', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/states',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.states.should.have.lengthOf(27);
                    for (var i = 1; i < data.states.length; i++) {
                        data.states[i].name.should.be.above(data.states[i-1].name, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
    it('ordenação por slug', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/states',
            {
                order: {'slug': -1}
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.states.should.have.lengthOf(27);
                    for (var i = 1; i < data.states.length; i++) {
                        data.states[i-1].slug.should.be.above(data.states[i].slug, 'não ordenou');
                    }
                    done();
                }
            }
        );
    });
});

describe('GET /country/:slug_country/state/:state_id', function () {
    before(function (done) {
        done();
    });

    it('url deve existir', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug,
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
    it('paÌs que não existe', function(done) {
        api.get('location', '/country/asdasdqqewasdasdasd/state/'+dt.state.slug,
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
    it('estado que n√£o existe', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/awoineaiionsndoinsdoisa',
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
    it('pega estado por id', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.id,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('state').have.property('_id', dt.state.id, 'os ids devem ser iguais');
                    data.should.have.property('state').have.property('slug', dt.state.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega estado por slug', function(done) {
        api.get('location', '/country/'+dt.country.slug+'/state/'+dt.state.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('state').have.property('_id', dt.state.id, 'os ids devem ser iguais');
                    data.should.have.property('state').have.property('slug', dt.state.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
    it('pega estado por id de pais', function(done) {
        api.get('location', '/country/'+dt.country.id+'/state/'+dt.state.slug,
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('state').have.property('_id', dt.state.id, 'os ids devem ser iguais');
                    data.should.have.property('state').have.property('slug', dt.state.slug, 'os slugs devem ser iguais');
                    done();
                }
            }
        );
    });
});