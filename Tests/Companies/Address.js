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
                    data.should.have.property('error').property('name', 'NotFoundError');
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
                    data.should.have.property('error').property('name', 'InvalidTokenError');
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
                    data.should.have.property('error').property('name', 'ValidationError');
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
                    data.should.have.property('error').property('name', 'ValidationError');
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
                    data.should.have.property('error').property('name', 'ValidationError');
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
                    data.should.have.property('error').property('name', 'ValidationError');
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
                    data.should.not.have.property('error');
                    data.should.have.property('address').have.property('_id');
                    data.should.have.property('address').have.property('street', street);
                    data.should.have.property('address').have.property('number', number);
                    data.should.have.property('address').have.property('complement', complement);
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
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('listar endereços', function(done) {
        api.get('companies', '/company/' + company + '/addresses', {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                for (var i = 0 ; i < data.addresses.length; i = i + 1) {
                    data.addresses[i].should.have.property('_id');
                    data.addresses[i].should.have.property('street');
                    data.addresses[i].should.have.property('number');
                    data.addresses[i].should.have.property('complement');
                    data.addresses[i].should.have.property('city');
                    data.addresses[i].should.have.property('headQuarters');
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
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data.address._id
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
                data.should.have.property('error').property('name', 'NotFoundError');
                done();
            }
        });
    });

    it('exibir endereço', function(done) {
        api.get('companies', '/company/' + company + '/address/' + address, {}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('street');
                data.should.have.property('address').have.property('number');
                data.should.have.property('address').have.property('complement');
                data.should.have.property('address').have.property('city');
                data.should.have.property('address').have.property('headQuarters');
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
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data.address._id
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
                data.should.have.property('error').property('name', 'InvalidTokenError');
                done();
            }
        });
    });

    it('empresa inexistente', function(done) {
        api.del('companies', '/company/inexistente/address/' + address, {token : token}, function(error, data, response) {
            if (error) {
                return done(error);
            } else {
                data.should.have.property('error').property('name', 'NotFoundError');
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
                    data.should.have.property('error').property('name', 'NotFoundError');
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
        address,
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
                api.post('companies', '/company/' + company + '/address', {
                    token   : token,
                    street : "Rua " + rand(),
                    number : "Numero " + rand(),
                    complement : "Complemento " + rand(),
                    city : "Cidade " + rand(),
                    headQuarters : true
                }, function(error, data, response) {
                    address = data.address._id;
                    obj = data.address;
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
                data.should.have.property('error').property('name', 'InvalidTokenError');
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
                data.should.have.property('error').property('name', 'NotFoundError');
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
                obj = data.address;
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('street', obj.street);
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
                obj = data.address;
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('number', obj.number);
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
                obj = data.address;
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('complement', obj.complement);
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
                obj = data.address;
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('headQuarters', obj.headQuarters);
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
                data.should.not.have.property('error');
                data.should.have.property('address').have.property('_id');
                data.should.have.property('address').have.property('street', street);
                data.should.have.property('address').have.property('number', number);
                data.should.have.property('address').have.property('complement', complement);
                done();
            }
        });
    });
});