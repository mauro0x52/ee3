/** Tests Companies.embedded
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller embedded do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /company/[slug]/embedded', function () {
    var token,
        slug,
        version,
        company;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('companies', '/company/' + company + '/embedded', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.post('companies', '/company/inexistente/embedded', {
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
        api.post('companies', '/company/' + company + '/embedded', {
                token     : 'tokeninvalido',
                embed     : 'Embedded ' + rand(),
                link      : {   
                    url  : 'Url ' + rand(),
                    type : 'Type ' + rand()
                }
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

    it('embed em branco', function(done) {
        api.post('companies', '/company/' + company + '/embedded', {
                token   : token,
                link      : {   
                    url  : 'Url ' + rand(),
                    type : 'Type ' + rand()
                }
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

    it('url em branco', function(done) {
        api.post('companies', '/company/' + company + '/embedded', {
                token   : token,
                embed     : 'Embedded ' + rand(),
                link      : {   
                    type : 'Type ' + rand()
                }
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
        api.post('companies', '/company/' + company + '/embedded', {
                token   : token,
                embed     : 'Embedded ' + rand(),
                link      : {   
                    url  : 'Url ' + rand()
                }
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

    it('tipo inválido', function(done) {
        api.post('companies', '/company/' + company + '/embedded', {
                token   : token,
                embed     : 'Embedded ' + rand(),
                link      : {   
                    url  : 'Url ' + rand(),
                    type : rand()
                }
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

    it('cadastra Embedded', function(done) {
        var embed = 'Embedded ' + rand(),
            url = 'Url ' + rand(),
            type = 'Youtube';
        api.post('companies', '/company/' + company + '/embedded', {
                token   : token,
                embed     : embed,
                link      : {   
                    url  : url,
                    type : type
                }
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('embedded').have.property('_id');
                    data.should.have.property('embedded').have.property('embed', embed);
                    data.should.have.property('embedded').have.property('link').property('url', url);
                    data.should.have.property('embedded').have.property('link').property('type', type);
                    done();
                }
            }
        );
    });
});

describe('GET /company/[slug]/embeddedes', function () {
    var token,
        slug,
        version,
        company,
        embeddedes = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('companies', '/company/' + company + '/embedded', {
                        token   : token,
                        embed     : 'Embedded ' + rand(),
                        link      : {   
                            url  : 'Url ' + rand(),
                            type : 'Youtube'
                        }
                    }, function(error, data, response) {
                        embeddedes++;
                        if (embeddedes === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/embeddeds', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.get('companies', '/company/inexistente/embeddeds', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar Embeddeds', function(done) {
        api.get('companies', '/company/' + company + '/embeddeds', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                for (var i = 0 ; i < data.embeddeds.length; i = i + 1) {
                    data.embeddeds[i].should.have.property('_id');
                    data.embeddeds[i].should.have.property('embed');
                    data.embeddeds[i].should.have.property('link').property('url');
                    data.embeddeds[i].should.have.property('link').property('type');
                }
                done();
            }
        });
    });
});

describe('GET /company/[slug]/embedded/[id]', function () {
    var token,
        slug,
        version,
        company,
        embedded;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/embedded', {
                    token   : token,
                    embed     : 'Embedded ' + rand(),
                    link      : {   
                        url  : 'Url ' + rand(),
                        type : 'Youtube'
                    }
                }, function(error, data, response) {
                    embedded = data.embedded._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/embedded/' + embedded, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                response.should.have.status(200);
                should.exist(data, 'não retornou dado nenhum');
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.get('companies', '/company/inexistente/embedded/' + embedded, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir Embedded', function(done) {
        api.get('companies', '/company/' + company + '/embedded/' + embedded, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');    
                data.should.have.property('embedded').have.property('_id');
                data.should.have.property('embedded').have.property('link').property('url');
                data.should.have.property('embedded').have.property('link').property('type');
                done();
            }
        });
    });
});

describe('DEL /company/[slug]/embedded/[id]', function () {
    var token,
        slug,
        version,
        company,
        embedded;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/embedded', {
                    token   : token,
                    embed     : 'Embedded ' + rand(),
                    link      : {   
                        url  : 'Url ' + rand(),
                        type : 'Youtube'
                    }
                }, function(error, data, response) {
                    embedded = data.embedded._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('companies', '/company/' + company + '/embedded/' + embedded, {}, function(error, data, response) {
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
        api.del('companies', '/company/' + company + '/embedded/' + embedded, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/embedded/' + embedded, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove Embedded', function(done) {
        api.del('companies', '/company/' + company + '/embedded/' + embedded, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('companies', '/company/' + company + '/embedded/' + embedded, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /company/[slug]/embedded/[id]', function () {
    var token,
        slug,
        version,
        company,
        embedded,
        obj;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.user.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'all',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.company.slug;
                api.post('companies', '/company/' + company + '/embedded', {
                    token   : token,
                    embed     : 'Embedded ' + rand(),
                    link      : {   
                        url  : 'Url ' + rand(),
                        type : 'Youtube'
                    }
                }, function(error, data, response) {
                    embedded = data.embedded._id;
                    obj = data;
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('companies', '/company/' + company + '/embedded/' + embedded, {}, function(error, data, response) {
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
        api.put('companies', '/company/' + company + '/embedded/' + embedded, {
            token : 'invalido',
            embed     : 'Embedded ' + rand(),
            link      : {   
                url  : 'Url ' + rand(),
                type : 'Youtube'
            }
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.put('companies', '/company/inexistente/embedded/' + embedded, {
            token   : token,
            embed     : 'Embedded ' + rand(),
            link      : {   
                url  : 'Url ' + rand(),
                type : 'Youtube'
            }
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('embed em branco', function(done) {
        api.put('companies', '/company/' + company + '/embedded/' + embedded, {
            token   : token,
            link      : {   
                url  : 'Url ' + rand(),
                type : 'Youtube'
            }
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                obj = data;
                should.not.exist(data.error);
                data.should.have.property('embedded').have.property('_id');
                data.should.have.property('embedded').have.property('embed', obj.embed);
                done();
            }
        });
    });
    
    it('edita Embedded', function(done) {
        var embed = 'Embedded ' + rand(),
            url = 'Url ' + rand(),
            type = 'Youtube';
        api.put('companies', '/company/' + company + '/embedded/' + embedded, {
            token   : token,
            embed     : embed,
            link      : {   
                url  : url,
                type : type
            }
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                data.should.have.property('embedded').have.property('_id');
                data.should.have.property('embedded').have.property('embed', embed);
                data.should.have.property('embedded').have.property('link').property('type', type);
                done();
            }
        });
    });
});