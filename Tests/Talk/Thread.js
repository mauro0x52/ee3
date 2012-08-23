/** Tests Talk.Thread
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thread do serviço Talk
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /thread', function () {
    var token,
        conversant;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('talk', '/thread', {}, function(error, data, response) {
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
        api.post('talk', '/thread', {
                token   : 'tokeninvalido',
                place   : 'Place ' + rand(),
                name    : 'Name ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('place');
                    data.should.not.have.property('name');
                    data.should.not.have.property('slug');
                    done();
                }
            }
        );
    });

    it('place em branco', function(done) {
        api.post('talk', '/thread', {
                token   : token,
                name    : 'Name ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('place');
                    data.should.not.have.property('name');
                    data.should.not.have.property('slug');
                    done();
                }
            }
        );
    });

    it('name em braco', function(done) {
        api.post('talk', '/thread', {
                token   : token,
                place   : 'Place ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data.error);
                    data.should.not.have.property('_id');
                    data.should.not.have.property('place');
                    data.should.not.have.property('name');
                    data.should.not.have.property('slug');
                    done();
                }
            }
        );
    });

    it('cadastrar thread', function(done) {
        api.post('talk', '/thread', {
                token   : token,
                place   : 'Place ' + rand(),
                name    : 'Name ' + rand()
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.not.exist(data.error, 'erro inesperado');
                    data.should.have.property('_id');
                    data.should.have.property('place');
                    data.should.have.property('name');
                    data.should.have.property('slug');
                    done();
                }
            }
        );
    });
});

describe('PUT /thread/[slug]', function () {
    var token,
        conversant,
        thread;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                api.post('talk', '/thread', {
                    token : token,
                    place : 'Place ' + rand(),
                    name  : 'Name ' + rand()
                }, function (error, data, response) {
                    thread = data.slug;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.put('talk', '/thread/' + thread, {}, function(error, data, response) {
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
        api.put('talk', '/thread/' + thread, {
            token : 'tokeninvalido'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('place');
                data.should.not.have.property('name');
                data.should.not.have.property('slug');
                done();
            }
        });
    });

    it('thread inexistente', function(done) {
        api.put('talk', '/thread/inexistente', {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('place');
                data.should.not.have.property('name');
                data.should.not.have.property('slug');
                done();
            }
        });
    });

    it('registra usuário na thread', function(done) {
        api.put('talk', '/thread/' + thread, {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('_id');
                data.should.have.property('place');
                data.should.have.property('name');
                data.should.have.property('slug');
                done();
            }
        });
    });
});

describe('GET /threads', function () {
    var token,
        conversant,
        threads = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('talk', '/thread', {
                        token : token,
                        place : 'Place ' + rand(),
                        name  : 'Name ' + rand()
                    }, function (error, data, response) {
                        threads++;
                        if (threads === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('talk', '/threads', {}, function(error, data, response) {
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
        api.get('talk', '/threads', {
            token : 'tokeninvalido'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('listar threads', function(done) {
        api.get('talk', '/threads', {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('name');
                    data[i].should.have.property('slug');
                    data[i].should.have.property('place');
                }
                done();
            }
        });
    });
});

describe('POST /thread/[slug]/message', function () {
    var token,
        conversant,
        thread;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                api.post('talk', '/thread', {
                    token : token,
                    place : 'Place ' + rand(),
                    name  : 'Name ' + rand()
                }, function (error, data, response) {
                    thread = data.slug;
                    done();
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('talk', '/thread/' + thread + '/message/', {}, function(error, data, response) {
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
        api.post('talk', '/thread/' + thread + '/message/', {
            token   : 'tokeninvalido',
            message : 'Mensagem ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('place');
                data.should.not.have.property('name');
                data.should.not.have.property('slug');
                done();
            }
        });
    });

    it('thread inexistente', function(done) {
        api.post('talk', '/thread/inexistente/message/', {
            token : token,
            message : 'Mensagem ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('place');
                data.should.not.have.property('name');
                data.should.not.have.property('slug');
                done();
            }
        });
    });

    it('mensagem em branco', function(done) {
        api.post('talk', '/thread/' + thread + '/message/', {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                data.should.not.have.property('_id');
                data.should.not.have.property('place');
                data.should.not.have.property('name');
                data.should.not.have.property('slug');
                done();
            }
        });
    });

    it('envia mensagem', function(done) {
        api.post('talk', '/thread/' + thread + '/message/', {
            token : token,
            message : 'Mensagem ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.should.have.property('_id');
                data.should.have.property('content');
                data.should.have.property('date');
                data.should.have.property('sender');
                done();
            }
        });
    });
});

describe('GET /thread/[slug]/messages', function () {
    var token,
        conversant,
        thread,
        messages = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                api.post('talk', '/thread', {
                    token : token,
                    place : 'Place ' + rand(),
                    name  : 'Name ' + rand()
                }, function (error, data, response) {
                    thread = data.slug;
                    for (var i = 0; i < 20; i = i + 1) {
                        api.post('talk','/thread/' + thread + '/message',  {
                            token  : token,
                            message: 'Messagem ' + rand()
                        }, function (error, data, response) {
                            messages++;
                            if (messages === 20) {
                                done();
                            }
                        });
                    }
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('talk', '/thread/' + thread + '/messages', {}, function(error, data, response) {
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
        api.get('talk', '/thread/' + thread + '/messages', {
            token   : 'tokeninvalido'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('thread inexistente', function(done) {
        api.get('talk', '/thread/inexistente/messages', {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('lista mensagens', function(done) {
        api.get('talk', '/thread/' + thread + '/messages', {
            token : token,
            message : 'Mensagem ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0; i < data.length; i = i + 1) {
                    data[i].should.have.property('content');
                    data[i].should.have.property('date');
                    data[i].should.have.property('sender');
                    data[i].should.have.property('_id');
                }
                done();
            }
        });
    });
});


describe('GET /thread/[slug]/unread-messages', function () {
    var token,
        conversant,
        thread,
        messages = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('talk', '/conversant', {
                token : token,
                label : 'Label ' + rand()
            }, function (error, data, response) {
                conversant = data._id;
                api.post('talk', '/thread', {
                    token : token,
                    place : 'Place ' + rand(),
                    name  : 'Name ' + rand()
                }, function (error, data, response) {
                    thread = data.slug;
                    for (var i = 0; i < 20; i = i + 1) {
                        api.post('talk','/thread/' + thread + '/message',  {
                            token  : token,
                            message: 'Messagem ' + rand()
                        }, function (error, data, response) {
                            messages++;
                            if (messages === 20) {
                                done();
                            }
                        });
                    }
                });
            });
        });
    });

    it('url tem que existir', function(done) {
        api.get('talk', '/thread/' + thread + '/unread-messages', {}, function(error, data, response) {
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
        api.get('talk', '/thread/' + thread + '/unread-messages', {
            token   : 'tokeninvalido'
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('thread inexistente', function(done) {
        api.get('talk', '/thread/inexistente/unread-messages', {
            token : token
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });

    it('lista mensagens', function(done) {
        api.get('talk', '/thread/' + thread + '/unread-messages', {
            token : token,
            message : 'Mensagem ' + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');
                data.length.should.be.above(19);
                for (var i = 0; i < data.length; i = i + 1) {
                    data[i].should.have.property('content');
                    data[i].should.have.property('date');
                    data[i].should.have.property('sender');
                    data[i].should.have.property('_id');
                }
                done();
            }
        });
    });
});
