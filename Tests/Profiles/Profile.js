/** Testes  Profiles.Profile
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Profile do serviço Profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    rand = require("../Utils.js").rand,
    random, user, profile;

random = rand();
user = {
    username : 'testes+' + random + '@empreendemia.com.br'
}
profile = {
    name : 'Nome' + random,
    surname : 'Sobrenome' + random
}


describe('POST /profile', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user.token = data.token;
            user._id = data._id;
            done();
        });
    });

    it('dados obrigatórios não preenchidos', function(done) {
        api.post('profiles', '/profile', {
            token : user.token
        }, function(error, data, response) {
            if (error) return done(error);
            else { 
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.slug);
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.post('profiles', '/profile', {
            token : 'arbufudbcu1b3124913r987bass978a',
            name : profile.name,
            surname : profile.surname,
            about : 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else { 
                response.should.have.status(200);
                should.exist(data.error);
                should.not.exist(data.slug);
                done();
            }
        });
    });
    it('cadastra profile', function(done) {
        api.post('profiles', '/profile', {
            token : user.token,
            name : profile.name,
            surname : profile.surname,
            about : 'sobre'
        }, function(error, data, response) {
            if (error) return done(error);
            else { 
                response.should.have.status(200);
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('slug');
                data.should.have.property('name', profile.name);
                data.should.have.property('surname', profile.surname);
                profile = data;
                done();
            }
        });
    });
});