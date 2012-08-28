/** Tests Companies.Address
 *
 * @autor : Rafael Almeida Erthal Hermano
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Address do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /company/[slug]/address', function () {
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
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                done();
            });
        });
    });

    it('url tem que existir', function(done) {
        api.post('companies', '/company/' + company + '/address', {}, function(error, data, response) {
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
        api.post('companies', '/company/inexistente/address', {
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
        api.post('companies', '/company/' + company + '/address', {
                token   : 'tokeninvalido',
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
            }
        );
    });

    it('street em branco', function(done) {
        api.post('companies', '/company/' + company + '/address', {
                token   : token,
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
            }
        );
    });

    it('number em branco', function(done) {
        api.post('companies', '/company/' + company + '/address', {
                token   : token,
                street : "Rua " + rand(),
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
            }
        );
    });

    it('complement em branco', function(done) {
        api.post('companies', '/company/' + company + '/address', {
                token   : token,
                street : "Rua " + rand(),
                number : "Numero " + rand(),
                city : "Cidade " + rand(),
                headQuarters : true
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

    it('headquarters em branco', function(done) {
        api.post('companies', '/company/' + company + '/address', {
                token   : token,
                street : "Rua " + rand(),
                number : "Numero " + rand(),
                complement : "Complemento " + rand(),
                city : "Cidade " + rand()
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

    it('cadastra endereço', function(done) {
        var street = "Rua " + rand(),
            number = "Numero " + rand(),
            complement = "Complemento " + rand(),
            city = "Cidade " + rand();
                
        api.post('companies', '/company/' + company + '/address', {
                token   : token,
                street : street,
                number : number,
                complement : complement,
                city : city,
                headQuarters : true
            }, function(error, data, response) {
                if (error) {
                    return done(error);
                } else { 
                    should.exist(data);
                    should.not.exist(data.error);
                    data.should.have.property('_id');
                    data.should.have.property('street', street);
                    data.should.have.property('number', number);
                    data.should.have.property('complement', complement);
                    data.should.have.property('city', city);
                    done();
                }
            }
        );
    });
});

describe('GET /company/[slug]/addresses', function () {
    var token,
        slug,
        version,
        company,
        addresses = 0;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                for (var i = 0; i < 20; i = i + 1) {
                    api.post('companies', '/company/' + company + '/address', {
                        token   : token,
                        street : "Rua " + rand(),
                        number : "Numero " + rand(),
                        complement : "Complemento " + rand(),
                        city : "Cidade " + rand(),
                        headQuarters : true
                    }, function(error, data, response) {
                        addresses++;
                        if (addresses === 20) {
                            done();
                        }
                    });
                }
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/addresses', {}, function(error, data, response) {
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
        api.get('companies', '/company/inexistente/addresses', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('listar endereços', function(done) {
        api.get('companies', '/company/' + company + '/addresses', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                data.length.should.be.above(19);
                for (var i = 0 ; i < data.length; i = i + 1) {
                    data[i].should.have.property('_id');
                    data[i].should.have.property('street');
                    data[i].should.have.property('number');
                    data[i].should.have.property('complement');
                    data[i].should.have.property('city');
                    data[i].should.have.property('headQuarters');
                }
                done();
            }
        });
    });
});

describe('GET /company/[slug]/address/[id]', function () {
    var token,
        slug,
        version,
        company,
        address;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.get('companies', '/company/' + company + '/address/' + address, {}, function(error, data, response) {
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
        api.get('companies', '/company/inexistente/address/' + address, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('exibir endereço', function(done) {
        api.get('companies', '/company/' + company + '/address/' + address, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error, 'erro inesperado');                
                data.should.have.property('_id');
                data.should.have.property('street');
                data.should.have.property('number');
                data.should.have.property('complement');
                data.should.have.property('city');
                data.should.have.property('headQuarters');
                done();
            }
        });
    });
});

describe('DEL /company/[slug]/address/[id]', function () {
    var token,
        slug,
        version,
        company,
        address;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.del('companies', '/company/' + company + '/address/' + address, {}, function(error, data, response) {
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
        api.del('companies', '/company/' + company + '/address/' + address, {token : 'invalido'}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/address/' + address, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('remove endereço', function(done) {
        api.del('companies', '/company/' + company + '/address/' + address, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data);
                api.get('companies', '/company/' + company + '/address/' + address, {token : token}, function (error, data) {
                    should.exist(data.error, 'não exclui');
                    done();
                });
            }
        });
    });
});

describe('PUT /company/[slug]/address/[id]', function () {
    var token,
        slug,
        version,
        company,
        address;

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            token = data.token;
            api.post('companies', '/company', {
                token : token,
                name : 'Compania ' + rand(),
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : 1,
                about: 'sobre'
            }, function(error, data, response) {
                company = data.slug;
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data._id
                    done();
                });
            });
        });
    });
    
    it('url tem que existir', function(done) {
        api.put('companies', '/company/' + company + '/address/' + address, {}, function(error, data, response) {
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
        api.put('companies', '/company/' + company + '/address/' + address, {
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
    
    it('empresa inexistente', function(done) {
        api.put('companies', '/company/inexistente/address/' + address, {
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
    
    it('street em branco', function(done) {
        api.put('companies', '/company/' + company + '/address/' + address, {
            token : token,
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
        api.put('companies', '/company/' + company + '/address/' + address, {
            token : token,
            street : "Rua " + rand(),
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
    
    it('complement em branco', function(done) {
        api.put('companies', '/company/' + company + '/address/' + address, {
            token : token,
            street : "Rua " + rand(),
            number : "Numero " + rand(),
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
    
    it('headQuarters em branco', function(done) {
        api.put('companies', '/company/' + company + '/address/' + address, {
            token : token,
            street : "Rua " + rand(),
            number : "Numero " + rand(),
            complement : "Complemento " + rand(),
            city : "Cidade " + rand()
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.exist(data.error);
                done();
            }
        });
    });
    
    it('edita endereço', function(done) {
        var street = "Rua " + rand(),
            number = "Numero " + rand(),
            complement = "Complemento " + rand(),
            city = "Cidade " + rand();
        api.put('companies', '/company/' + company + '/address/' + address, {
            token   : token,
            street : street,
            number : number,
            complement : complement,
            city : city,
            headQuarters : true
        }, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                should.not.exist(data.error);
                data.should.have.property('_id');
                data.should.have.property('street', street);
                data.should.have.property('number', number);
                data.should.have.property('complement', complement);
                data.should.have.property('city', city);
                done();
            }
        });
    });
});