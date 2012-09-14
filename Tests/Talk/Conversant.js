/** Tests Talk.Conversant
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Conversant do serviço Talk
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /conversant', function () {
    var token;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            done();
        });
    });

    it('url tem que existir', function(done) {
        api.post('talk', '/conversant', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function(done) {
        api.post('talk', '/conversant', {
                token   : 'tokeninvalido',
                label   : 'Label ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });

    it('label em branco', function(done) {
        api.post('talk', '/conversant', {
                token   : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('cadastrar conversant', function(done) {
        api.post('talk', '/conversant', {
                token   : token,
                label   : 'Label ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('conversant').have.property('_id');
                    data.should.have.property('conversant').have.property('label');
                    data.should.have.property('conversant').have.property('user');
                    done();
                }
            }
        );
    });
});

describe('PUT /conversant/[id]/change-label', function () {
    var token,
        conversant,
        obj;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data.conversant._id;
                obj = data.conversant
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('talk', '/conversant/' + conversant + '/change-label', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('token errado', function(done) {
        api.put('talk', '/conversant/' + conversant + '/change-label', {
                token     : 'tokeninvalido',
                new_label : 'Label ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });

    it('label em branco', function(done) {
        api.put('talk', '/conversant/' + conversant + '/change-label', {
                token   : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    obj = data;
                    data.should.not.have.property('error');
                    data.should.have.property('conversant').have.property('_id');
                    data.should.have.property('conversant').have.property('label', obj.label);
                    done();
                }
            }
        );
    });

    it('editar label', function(done) {
        var new_label = 'Label ' + rand();
        api.put('talk', '/conversant/' + conversant + '/change-label', {
                token     : token,
                new_label : new_label
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('conversant').have.property('_id');
                    data.should.have.property('conversant').have.property('label', new_label);
                    data.should.have.property('conversant').have.property('user');
                    done();
                }
            }
        );
    });
});