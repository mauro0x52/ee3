/** Tests profiles.phone
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller phone do serviço profiles
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /profile/[slug]/phone', function () {
    var token,
        slug,
        version,
        profile;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('perfil inexistente', function(done) {
        api.post('profiles', '/profile/inexistente/phone', {
                token : token
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('token errado', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token     : 'tokeninvalido',
                number    : 'Number ' + rand(),
                extension : 'extension ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                intCode   : 'intCode ' + rand(),
                type      : 'home'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('number em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                extension : 'extension ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                intCode   : 'intCode ' + rand(),
                type      : 'home'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('extension em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : 'Number ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                intCode   : 'intCode ' + rand(),
                type      : 'home'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('areaCode em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : 'Number ' + rand(),
                extension : 'extension ' + rand(),
                intCode   : 'intCode ' + rand(),
                type      : 'home'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('intCode em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : 'Number ' + rand(),
                extension : 'extension ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                type      : 'home'
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('type em branco', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : 'Number ' + rand(),
                extension : 'extension ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                intCode   : 'intCode ' + rand(),
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('type inválido', function(done) {
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : 'Number ' + rand(),
                extension : 'extension ' + rand(),
                areaCode  : 'areaCode ' + rand(),
                type      : rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    done();
                }
            }
        );
    });

    it('cadastra telefone', function(done) {
        var number    = 'Number ' + rand(),
            extension = 'extension ' + rand(),
            areaCode  = 'areaCode ' + rand(),
            intCode   = 'intCode ' + rand(),
            type      = 'home';
        api.post('profiles', '/profile/' + profile + '/phone', {
                token   : token,
                number    : number,
                extension : extension,
                areaCode  : areaCode,
                intCode   : intCode,
                type      : type
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('phone').have.property('_id');
                    data.should.have.property('phone').have.property('number', number);
                    data.should.have.property('phone').have.property('extension', extension);
                    data.should.have.property('phone').have.property('areaCode', areaCode);
                    data.should.have.property('phone').have.property('intCode', intCode);
                    data.should.have.property('phone').have.property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /profile/[slug]/phonees', function () {
    var token,
        slug,
        version,
        profile,
        phonees = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('profiles', '/profile/' + profile + '/phone', {
                        token   : token,
                        number    : 'Number ' + rand(),
                        extension : 'extension ' + rand(),
                        areaCode  : 'areaCode ' + rand(),
                        intCode   : 'intCode ' + rand(),
                        type      : 'home'
                    }, function(error, data, response) {
                        phonees++;
                        if (phonees === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/phones', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/phones', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar telefones', function(done) {
        api.get('profiles', '/profile/' + profile + '/phones', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                data.phones.length.should.be.above(19);
                for (var i = 0 ; i < data.phones.length; i = i + 1) {
                    data.phones[i].should.have.property('_id');
                    data.phones[i].should.have.property('number');
                    data.phones[i].should.have.property('extension');
                    data.phones[i].should.have.property('areaCode');
                    data.phones[i].should.have.property('intCode');
                    data.phones[i].should.have.property('type');
                }
                done();
            }
        });
    });
});

describe('GET /profile/[slug]/phone/[id]', function () {
    var token,
        slug,
        version,
        profile,
        phone;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/phone', {
                    token   : token,
                    number    : 'Number ' + rand(),
                    extension : 'extension ' + rand(),
                    areaCode  : 'areaCode ' + rand(),
                    intCode   : 'intCode ' + rand(),
                    type      : 'home'
                }, function(error, data, response) {
                    phone = data.phone._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('profiles', '/profile/' + profile + '/phone/' + phone, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.get('profiles', '/profile/inexistente/phone/' + phone, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir telefone', function(done) {
        api.get('profiles', '/profile/' + profile + '/phone/' + phone, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');    
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('number');
                data.should.have.property('phone').have.property('extension');
                data.should.have.property('phone').have.property('areaCode');
                data.should.have.property('phone').have.property('intCode');
                data.should.have.property('phone').have.property('type');
                done();
            }
        });
    });
});

describe('DEL /profile/[slug]/phone/[id]', function () {
    var token,
        slug,
        version,
        profile,
        phone;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/phone', {
                    token   : token,
                    number    : 'Number ' + rand(),
                    extension : 'extension ' + rand(),
                    areaCode  : 'areaCode ' + rand(),
                    intCode   : 'intCode ' + rand(),
                    type      : 'home'
                }, function(error, data, response) {
                    phone = data.phone._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('profiles', '/profile/' + profile + '/phone/' + phone, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('token inválido', function(done) {
        api.del('profiles', '/profile/' + profile + '/phone/' + phone, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.del('profiles', '/profile/inexistente/phone/' + phone, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove telefone', function(done) {
        api.del('profiles', '/profile/' + profile + '/phone/' + phone, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('profiles', '/profile/' + profile + '/phone/' + phone, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /profile/[slug]/phone/[id]', function () {
    var token,
        slug,
        version,
        profile,
        phone,
        obj;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('profiles', '/profile', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'profile',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                profile = data.profile.slug;
                api.post('profiles', '/profile/' + profile + '/phone', {
                    token   : token,
                    number    : 'Number ' + rand(),
                    extension : 'extension ' + rand(),
                    areaCode  : 'areaCode ' + rand(),
                    intCode   : 'intCode ' + rand(),
                    type      : 'home'
                }, function(error, data, response) {
                    phone = data.phone._id;
                    obj = data.phone;
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('token inválido', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : 'invalido',
            street : "Rua " + rand(),
            number : "Numero " + rand(),
            complement : "Complemento " + rand(),
            city : "Cidade " + rand(),
            headQuarters : true
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('perfil inexistente', function(done) {
        api.put('profiles', '/profile/inexistente/phone/' + phone, {
            token : token,
            street : "Rua " + rand(),
            number : "Numero " + rand(),
            complement : "Complemento " + rand(),
            city : "Cidade " + rand(),
            headQuarters : true
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('number em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : token,
            extension : 'extension ' + rand(),
            areaCode  : 'areaCode ' + rand(),
            intCode   : 'intCode ' + rand(),
            type      : 'home'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.phone;
                should.not.exist(data.error);
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('number', obj.number);
                done();
            }
        });
    });
    
    it('extension em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : token,
            number    : 'Number ' + rand(),
            areaCode  : 'areaCode ' + rand(),
            intCode   : 'intCode ' + rand(),
            type      : 'home'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.phone;
                should.not.exist(data.error);
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('extension', obj.extension);
                done();
            }
        });
    });
    
    it('areaCode em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : token,
            number    : 'Number ' + rand(),
            extension : 'extension ' + rand(),
            intCode   : 'intCode ' + rand(),
            type      : 'home'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.phone;
                should.not.exist(data.error);
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('areaCode', obj.areaCode);
                done();
            }
        });
    });
    
    it('intCode em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : token,
            number    : 'Number ' + rand(),
            extension : 'extension ' + rand(),
            areaCode  : 'areaCode ' + rand(),
            type      : 'home'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.phone;
                should.not.exist(data.error);
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('intCode', obj.intCode);
                done();
            }
        });
    });
    
    it('type em branco', function(done) {
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token : token,
            number    : 'Number ' + rand(),
            extension : 'extension ' + rand(),
            areaCode  : 'areaCode ' + rand(),
            intCode   : 'intCode ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data.phone;
                should.not.exist(data.error);
                data.should.have.property('phone').have.property('_id');
                data.should.have.property('phone').have.property('type', obj.type);
                done();
            }
        });
    });
    
    it('edita telefone', function(done) {
        var number    = 'Number ' + rand(),
            extension = 'extension ' + rand(),
            areaCode  = 'areaCode ' + rand(),
            intCode   = 'intCode ' + rand(),
            type      = 'home';
        api.put('profiles', '/profile/' + profile + '/phone/' + phone, {
            token   : token,
            number    : number,
            extension : extension,
            areaCode  : areaCode,
            intCode   : intCode,
            type      : type
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                api.get('profiles', '/profile/' + profile + '/phone/' + phone, {token : token}, function (error, data) {
                    should.not.exist(data.error, 'algo deu errado');
                    data.should.have.property('phone').have.property('_id');
                    data.should.have.property('phone').have.property('number', number);
                    data.should.have.property('phone').have.property('extension', extension);
                    data.should.have.property('phone').have.property('areaCode', areaCode);
                    data.should.have.property('phone').have.property('intCode', intCode);
                    data.should.have.property('phone').have.property('type', type);
                    done();
                });
            }
        });
    });
});