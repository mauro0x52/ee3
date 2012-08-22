/** Testes do Auth.User
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller User do serviço Auth
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand;

describe('POST /user', function () {
    it('página /user não encontrada', function (done) {
        api.post('auth', '/user', {
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active'
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });

    it('retorna erro se não preencher username', function (done) {
        api.post('auth', '/user', {
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active'
        }, function (error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });
    it('retorna erro se não preencher password', function (done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            status : 'active'
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });
    it('retorna erro se preencher password_confirmation incorretamente', function(done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'asuidiudhsas',
            status : 'active'
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, 'deveria retornar erro');
                done();
            }
        });
    });
    it('retorna token se o cadastro for sucesso', function(done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active'
        }, function(error, data, response) {
            should.exist(data, 'não retornou dado nenhum');
            should.not.exist(data.error, "precisava retornar error");
            should.exist(data.token, "não retornou o token");
            should.exist(data.username, "não retornou o username");
            should.exist(data.password, "não retornou o password");
            should.exist(data.status, "não retornou o status");
            should.exist(data.thirdPartyLogins, "não retornou o thirdPartyLogins");
            should.exist(data.authorizedApps, "não retornou o authorizedApps");
            done();
        });
    });
    it('retorna erro se tenta cadastrar username que já existe', function(done) {
        var username = 'testes+' + rand() + '@empreendemia.com.br';
        api.post('auth', '/user', {
            username : username,
            password : 'testando',
            password_confirmation : 'testando',
            status : 'active'
        }, function(error, data, response) {
            api.post('auth', '/user', {
                username : username,
                password : 'testando',
                password_confirmation : 'testando',
                status : 'active'
            }, function (error, data, response) {
                should.exist(data, 'não retornou dado nenhum');
                should.exist(data.error, 'precisa retornar erro');
                done();
            });
        });
    });
});

describe('PUT /user/[login]/deactivate', function () {
    var token,
        userId;

    before(function (done) {
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.put('auth', '/user/'+userId+"/deactivate", {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('desativada com sucesso', function (done) {
        api.put('auth', '/user/'+userId+"/deactivate", {
            token : token
        }, function (error, data, response) {
            //console.log(data.error);
            should.not.exist(data, 'erro inexperado');
            done();
        });
    });
    it('token em branco', function (done) {
        api.put('auth', '/user/'+userId+"/deactivate", {
            //token : token
        }, function (error, data, response) {
            should.exist(data, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.put('auth', '/user/'+userId+"/deactivate", {
            token : token+"asdasdasdas"
        }, function (error, data, response) {
            should.exist(data, 'deveria retornar erro');
            done();
        });
    });
});

describe('PUT /user/[login]/activate', function () {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.put('auth', '/user/'+userId+"/activate", {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('ativada com sucesso', function (done) {
        api.put('auth', '/user/'+userId+"/activate", {
            token : token
        }, function (error, data, response) {
            should.not.exist(data, 'não deveria retornar erro');
            done();
        });
    });
    it('token em branco', function (done) {
        api.put('auth', '/user/'+userId+"/activate", {
            //token : token
        }, function (error, data, response) {
            should.exist(data, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.put('auth', '/user/'+userId+"/activate", {
            token : token+"asdasdasdas"
        }, function (error, data, response) {
            should.exist(data, 'deveria retornar erro');
            done();
        });
    });
    it('usuário inválido', function (done) {
        api.put('auth', '/user/'+userId+"223das123asd/activate", {
            token : token
        }, function (error, data, response) {
            should.exist(data, 'deveria retornar erro');
            done();
        });
    });
});

describe('PUT /user/[login]/password-recovery', function () {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            token : token
        }, function (error, data, response) {
            response.should.have.status(200);
            done();
        });
    });
    it('trocar de senha com sucesso', function(done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            newpassword : 'testando',
            newpasswordconfirmation : 'testando',
            token : token
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                should.not.exist(data.error, "não era para retornar erro");
                data.should.have.property('token');
                data.should.have.property('username');
                data.should.have.property('password');
                data.should.have.property('status');
                data.should.have.property('thirdPartyLogins');
                data.should.have.property('authorizedApps');
                done();
            }
        });
    });
    it('token em branco', function(done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            newpassword : 'testando',
            newpasswordconfirmation : 'testando',
        }, function(error, data, response) {
            if (error) {
                done(error);
            } else {
                should.exist(data.error, "era para retornar erro");
                done();
            }
        });
    });
    it('usuário não cadastrado', function(done) {
        api.put('auth', '/user/'+userId+"123asd123asd123/password-recovery", {
            newpassword : 'testando',
            newpasswordconfirmation : 'testando',
            token : token
        }, function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            done();
        });
    });
    it('token errado', function(done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            newpassword : 'testando',
            newpasswordconfirmation : 'testando',
            token : token+"asdad123123asd"
        }, function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            done();
        });
    });
    it('Senhas não batem', function(done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            newpassword : 'testando',
            newpasswordconfirmation : 'testando123123123123',
            token : token
        }, function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            done();
        });
    });
    it('Senhas em branco', function(done) {
        api.put('auth', '/user/'+userId+"/password-recovery", {
            newpassword : '',
            newpasswordconfirmation : '',
            token : token
        }, function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            done();
        });
    });
});

describe('PUT /user/[login]/login', function() {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.put('auth', '/user/'+userId+'/login', {
            password : "testando"
        },
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });
    it('autenticado com sucesso', function (done) {
        api.put('auth', '/user/'+userId+'/login', {
            password : "testando"
        },
        function(error, data, response) {
            should.not.exist(data.error, "não era para retornar erro");
            should.exist(data.token, "não retornou o token");
            done();
        }
        );
    });
    it('usuário não existe', function (done) {
        api.put('auth', '/user/'+userId+'asd123asd123/login', {
            password : "testando"
        },
        function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            should.not.exist(data.token, "não era para enviar o token");
            done();
        }
        );
    });
    it('senha em branco', function (done) {
        api.put('auth', '/user/'+userId+'/login', {
            password : ""
        },
        function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            should.not.exist(data.token, "não era para enviar o token");
            done();
        }
        );
    });
    it('senha errada', function (done) {
        api.put('auth', '/user/'+userId+'/login', {
            password : "1234567"
        },
        function(error, data, response) {
            should.exist(data.error, "era para retornar erro");
            should.not.exist(data.token, "não era para enviar o token");
            done();
        }
        );
    });
});

describe('PUT /user/[login]/logout', function() {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.put('auth', '/user/'+userId+'/logout', {
            token : token
        },
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });
    it('deslogado com sucesso', function (done) {
        api.put('auth', '/user/'+userId+'/logout', {
            token : token
        },
        function(error, data, response) {
            should.not.exist(data, "não era para retornar nehum dado");
            done();
        }
        );
    });
    it('usuário não existe', function (done) {
        api.put('auth', '/user/'+userId+'asd123asd123/logout', {
            token : token
        },
        function(error, data, response) {
            should.exist(data, "era para retornar erro");
            done();
        }
        );
    });
    it('token errado', function (done) {
        api.put('auth', '/user/'+userId+'asd123asd123/logout', {
            token : token+"asd123"
        },
        function(error, data, response) {
            should.exist(data, "era para retornar erro");
            done();
        }
        );
    });
    it('token em branco', function (done) {
        api.put('auth', '/user/'+userId+'asd123asd123/logout', {
            //token : token+"asd123"
        },
        function(error, data, response) {
            should.exist(data, "era para retornar erro");
            done();
        }
        );
    });
});

describe('GET /user/validate', function() {
    var token,
        userId;

    before(function (done) {
        // cria um usuario
        api.post('auth', '/user', {
            username : 'testes+' + rand() + '@empreendemia.com.br',
            password : 'testando',
            password_confirmation : 'testando',
            satus : 'active'
        }, function(error, data) {
            token = data.token;
            userId = data._id;
            done();
        });
    });
    it('página não encontrada', function (done) {
        api.get('auth', '/user/validate', {
            token : token
        },
        function(error, data, response) {
            response.should.have.status(200);
            done();
        }
        );
    });
    it('valida usuário com sucesso', function (done) {
        api.get('auth', '/user/validate', {
            token : token
        },
        function(error, data, response) {
            should.exist(data, 'não retornou dado nenhum');
            should.not.exist(data.error, 'Não era para retornar erro');
            should.exist(data._id, 'Precisava retornar o ID');
            done();
        }
        );
    });
    it('token em branco', function (done) {
        api.get('auth', '/user/validate', {
            //token : token
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
    it('token errado', function (done) {
        api.get('auth', '/user/validate', {
            token : token+"asdasdasdas"
        }, function (error, data, response) {
            should.exist(data.error, 'deveria retornar erro');
            done();
        });
    });
});
