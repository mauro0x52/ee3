/** Testes  Profiles.Thumbnail
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thumbnail do serviço Profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    rand = require("../Utils.js").rand,
    random,
    user, profile,
    user2, profile2;


describe('POST /profile/:profile_id/thumbnail', function () {
    before(function (done) {
        random = rand();
        user = {
            username : 'testes+' + random + '@empreendemia.com.br'
        };
        profile = {
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        };
        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user.token = data.user.token;
            // cria empresa
            api.post('profiles', '/profile', {
                token : user.token,
                name : profile.name,
                surname : profile.surname,
                about : 'sobre'
            }, function(error, data) {
                profile = data.profile;
                if (error) return done(error);
                else done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('profiles', '/profile/' + profile.slug + '/thumbnail',
            {},
            function (error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data, 'não retornou dado nenhum');
                    done();
                }
            }
        );
    });
    it('não envia imagem', function(done) {
        api.file('profiles', '/profile/' + profile.slug + '/thumbnail',
            {
                token : user.token
            },
            {},
            function (error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('não envia imagem', function(done) {
        api.file('profiles', '/profile/' + profile.slug + '/thumbnail',
            {
                token : 'euSouUmTokenMuitoErradoHauehauheauhaeuhea'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('envia imagem', function(done) {
        api.file('profiles', '/profile/' + profile.slug + '/thumbnail',
            {
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('thumbnail').property('original').property('url')
                        .match(/^http\:\/\/.+\/profiles\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
                    data.should.have.property('thumbnail').property('small').property('url')
                        .match(/^http\:\/\/.+\/profiles\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
                    data.should.have.property('thumbnail').property('medium').property('url')
                        .match(/^http\:\/\/.+\/profiles\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
                    data.should.have.property('thumbnail').property('large').property('url')
                        .match(/^http\:\/\/.+\/profiles\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
                    profile.thumbnail = data.thumbnail;
                    done();
                }
            }
        );
    });
    it('envia imagem novamente', function (done) {
        api.file('profiles', '/profile/' + profile.slug + '/thumbnail',
            {
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('thumbnail').property('original').property('url')
                        .match(/^http\:\/\/.+\/profiles\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente')
                        .not.equal(profile.thumbnail.original.url);
                    profile.thumbnail = data.thumbnail;
                    done();
                }
            }
        );
    });
});

describe('GET /company/:profile_id/thumbnail', function () {

    before(function (done) {
        random = rand();
        user2 = {
            username : 'testes+' + random + '@empreendemia.com.br'
        };
        profile2 = {
            name : 'Nome' + random,
            surname : 'Sobrenome' + random
        };

        // cria usuario
        api.post('auth', '/user',
            {
                username : user2.username,
                password : 'testando',
                password_confirmation : 'testando'
            },
            function(error, data) {
                user2.token = data.user.token;
                // cria profile
                api.post('profiles', '/profile', {
                    token : user2.token,
                    name : profile2.name,
                    surname : profile2.surname,
                    about : 'sobre'
                }, function(error, data) {
                    profile2 = data.profile;
                    if (error) return done(error);
                    else done();
                });
            }
        );
    });

    it('url existe', function (done) {
        api.get('profiles', '/profile/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('perfil não existe', function (done) {
        api.get('profiles', '/profile/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
            should.exist(data.error, 'não retornou erro');
            done();
        });
    });
    it('perfil com thumbnail', function (done) {
        api.get('profiles', '/profile/' + profile.slug + '/thumbnail', {}, function(error, data, response) {
            should.not.exist(data.error, 'retornou erro inexperado');
            data.should.have.property('thumbnail').property('original').property('url')
               .equal(profile.thumbnail.original.url)
            done();
        });
    });
    it('perfil sem thumbnail', function (done) {
        api.get('profiles', '/profile/' + profile2.slug + '/thumbnail', {}, function(error, data, response) {
            should.not.exist(data, 'retorna vazio');
            done();
        });
    });
});

describe('GET /profile/:profile_id/thumbnail/:size', function() {
    it('url existe', function (done) {
        api.get('profiles', '/profile/asddasddaoiheoins/thumbnail/daoishoihe', {}, function(error, data, response) {
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('perfil não existe', function (done) {
        api.get('profiles', '/profile/asddasddaoiheoins/thumbnail/daoishoihe', {}, function(error, data, response) {
            should.exist(data.error, 'tem que retornar erro');
            done();
        });
    });
    it('pega tamanho medio', function (done) {
        api.get('profiles', '/profile/' + profile.slug + '/thumbnail/medium', {}, function(error, data, response) {
            should.not.exist(data.error, 'não pode retornar erro');
            data.should.have.property('medium').property('url')
                .equal(profile.thumbnail.medium.url);
            done();
        });
    });
    it('tamanho qualquer retorna small', function (done) {
        api.get('profiles', '/profile/' + profile.slug + '/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
            should.not.exist(data.error, 'não pode retornar erro');
            data.should.have.property('small').property('url')
                .equal(profile.thumbnail.small.url);
            done();
        });
    });
    it('perfil sem thumbnail', function (done) {
        api.get('profiles', '/profile/' + profile2.slug + '/thumbnail/medium', {}, function(error, data, response) {
            should.not.exist(data, 'deve retornar vazio');
            done();
        });
    });
});

describe('DEL /profile/:profile_id/thumbnail', function() {
    it('url existe', function (done) {
        api.del('profiles', '/profile/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('token invalido', function (done) {
        api.del('profiles', '/profile/' + profile.slug + '/thumbnail',
            {},
            function(error, data, response) {
                should.exist(data.error, 'tem que retornar erro');
                done();
            }
        );
    });
    it('remove com sucesso', function (done) {
        api.del('profiles', '/profile/' + profile.slug + '/thumbnail',
            { token : user.token },
            function(error, data, response) {
                should.not.exist(data, 'deve retornar vazio');
                api.get('profiles', '/profile/' + profile.slug + '/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
                    should.not.exist(data, 'deve retorna vazio (get)');
                    done();
                });
            }
        );
    });
});