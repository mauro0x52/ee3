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
    random, userA, profileA;

random = rand();
userA = {
    username : 'testes+' + random + '@empreendemia.com.br'
}

userB = {
    username : 'testes+b' + random + '@empreendemia.com.br'
}

describe('POST /profile', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : userA.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            userA.token = data.token;
            userA._id = data._id;
            // cria outro usuario
            api.post('auth', '/user', {
                username : userB.username,
                password : 'testando',
                password_confirmation : 'testando'
            }, function(error, data) {
                userB.token = data.token;
                userB._id = data._id;
                done();
            });
        });
    });

    it('dados obrigatórios não preenchidos', function(done) {
        api.post('profiles', '/profile', {
            token : userA.token
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
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
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
            token : userA.token,
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('slug').equal('nome'+random+'-sobrenome'+random);
                data.should.have.property('name').equal('Nome' + random);
                data.should.have.property('surname').equal('Sobrenome' + random);
                profileA = data;
                done();
            }
        });
    });
    it('outro profile com mesmo nome', function(done) {
        api.post('profiles', '/profile', {
            token : userB.token,
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('slug')
                    .include(profileA.slug)
                    .match(/nome[0-9,a-f]{2,}\-sobrenome[0-9,a-f]{2,}\-[0-9,a-f]{2,}/);
                data.should.have.property('name').equal('Nome' + random);
                data.should.have.property('surname').equal('Sobrenome' + random);
                profileA = data;
                done();
            }
        });
    });
});

describe('GET /profile/:profile_id', function() {
    it('perfil que não existe');
    it('perfil pelo id');
    it('perfil pelo slug');
});

describe('PUT /profile/:profile_id', function() {
    it('token inválido');
    it('perfil que não existe');
    it('perfil de outro usuário');
    it('mantém o slug');
    it('altera o slug');
});

describe('DEL /profile/:profile_id', function() {
    it('token inválido');
    it('perfil que não existe');
    it('perfil de outro usuário');
    it('remove perfil');
});
