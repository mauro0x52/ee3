/** Testes  Companies.Thumbnail
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thumbnail do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    companyImageUrl, productImageUrl, random,
    user, company, product,
    user2, company2, productName2, company2, product2,
    user3, company3;

random = rand();
user = {username : 'testes+' + random + '@empreendemia.com.br'};
company = {name : 'Empresa ' + random};

describe('POST /company/[id]/thumbnail', function () {
    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : user.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user.token = data.token;
            // cria empresa
            api.post('companies', '/company', {
                token : user.token,
                name : company.name,
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : true
            }, function(error, data) {
                company = data;
                if (error) return done(error);
                else done();
            });
        });
    });


    it('url existe', function(done) {
        api.post('companies', '/company/' + company.slug + '/thumbnail',
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(response, 'serviço de companies está inacessível');
                    response.should.have.status(200);
                    done();
                }
            }
        );
    });
    it('não envia imagem', function(done) {
        api.file('companies', '/company/' + company.slug + '/thumbnail',
            {
                token : user.token
            },
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('token errado', function(done) {
        api.file('companies', '/company/' + company.slug  + '/thumbnail',
            {
                token : 'asd8vc89vc7vcx89fas872gjhibas'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data && data.error ? true : undefined, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('envia imagem', function(done) {
        api.file('companies', '/company/' + company.slug  + '/thumbnail',
            {
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.not.exist(data.error, 'não pode retornar erro');
                    (data && data.original && data.original.url ? data.original.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
                    (data && data.small && data.small.url ? data.small.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
                    (data && data.medium && data.medium.url ? data.medium.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
                    (data && data.large && data.large.url ? data.large.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
                    company.thumbnail = data;
                    done();
                }
            }
        );
    });

    it('envia imagem novamente', function (done) {
        api.file('companies', '/company/' + company.slug  + '/thumbnail',
            {
                login : user.username,
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.not.exist(data && data.error ? true : undefined);
                    (data && data.original && data.original.url ? data.original.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
                    (data && data.small && data.small.url ? data.small.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
                    (data && data.medium && data.medium.url ? data.medium.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
                    (data && data.large && data.large.url ? data.large.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
                    company.thumbnail.original.url.should.not.equal(data && data.original && data.original.url ? data.original.url : '', 'as urls deveriam ser diferentes');
                    company.thumbnail = data;
                    done();
                }
            }
        );
    });
});

random = rand();
user2 = {username : 'testes+' + random + '@empreendemia.com.br'};
company2 = {name : 'Empresa ' + random};

describe('GET /company/[id]/thumbnail', function () {

    before(function (done) {
        // cria usuario
        api.post('auth', '/user',
            {
                username : user2.username,
                password : 'testando',
                password_confirmation : 'testando'
            },
            function(error, data) {
                user2.token = data.token;
                // cria empresa
                api.post('companies', '/company',
                    {
                        login : user2.username,
                        token : user2.token,
                        users : [user2.username],
                        name : company2.name,
                        activity : 'consultoria em testes',
                        type : 'company',
                        profile : 'both',
                        active : true
                    },
                    function(error, data) {
                        company2 = data;
                        if (error) return done(error);
                        else done();
                    }
                );
            }
        );
    });

    it('empresa não existe', function (done) {
        api.get('companies', '/company/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            should.exist(data && data.error ? true : undefined, 'não retornou erro');
            done();
        });
    });
    it('empresa com thumbnail', function (done) {
        api.get('companies', '/company/' + company.slug + '/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            should.not.exist(data && data.error ? true : undefined, 'retornou erro inexperado');
            (data && data.original && data.original.url ? data.original.url : '')
                .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
            (data && data.small && data.small.url ? data.small.url : '')
                .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
            (data && data.medium && data.medium.url ? data.medium.url : '')
                .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
            (data && data.large && data.large.url ? data.large.url : '')
                .should.match(/^http\:\/\/.+\/companies\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
            done();
        });
    });
    it('empresa sem thumbnail', function (done) {
        api.get('companies', '/company/' + company2.slug  + '/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.not.exist(data, 'deveria retornar undefined')
            should.not.exist(data && data.error ? true : undefined, 'retornou erro inexperado');
            done();
        });
    });
});


describe('GET /company/:company_id/thumbnail/:size', function() {
    it('url existe', function (done) {
        api.get('companies', '/company/fassafsafassad/thumbnail/daoishoihe', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('empresa não existe', function (done) {
        api.get('companies', '/company/fassafsafassad/thumbnail/daoishoihe', {}, function(error, data, response) {
            if (error) return done(error);
            should.exist(data.error, 'tem que retornar erro');
            done();
        });
    });
    it('pega tamanho medio', function (done) {
        api.get('companies', '/company/'+company.slug+'/thumbnail/medium', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data.error, 'não pode retornar erro');
            (company.thumbnail.medium.url).should.equal(data.url);
            done();
        });
    });
    it('tamanho qualquer retorna small', function (done) {
        api.get('companies', '/company/'+company.slug+'/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data.error, 'não pode retornar erro');
            (company.thumbnail.small.url).should.equal(data.url);
            done();
        });
    });
    it('empresa sem thumbnail', function (done) {
        api.get('companies', '/company/'+company2.slug+'/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data, 'deve retornar vazio');
            done();
        });
    });
});



random = rand();
user3 = {username:'testes+' + random + '@empreendemia.com.br'};
company3 = {name:'Empresa ' + random};

describe('DEL /company/[id]/thumbnail', function() {

    before(function (done) {
        // cria usuario
        api.post('auth', '/user', {
            username : user3.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            user3.token = data.token;
            // cria empresa
            api.post('companies', '/company', {
                token : user3.token,
                name : company3.name,
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : true
            }, function(error, data) {
                company3 = data;
                if (error) return done(error);
                else done();
            });
        });
    });
    it('url existe', function (done) {
        api.del('companies', '/company/asddasddaoiheoins/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('token invalido', function (done) {
        api.del('companies', '/company/' + company3.slug + '/thumbnail',
            {},
            function(error, data, response) {
                if (error) return done(error);
                should.exist(data.error, 'tem que retornar erro');
                done();
            }
        );
    });
    it('remove com sucesso', function (done) {
        api.del('companies', '/company/' + company3.slug + '/thumbnail',
            { token : user3.token },
            function(error, data, response) {
                if (error) return done(error);
                should.not.exist(data, 'retorna vazio');
                api.get('companies', '/company/' + company3.slug + '/thumbnail', {}, function(error, data, response) {
                    should.not.exist(data, 'retorna vazio (get)');
                    done();
                });
            }
        );
    });
});



// -----------------------------------------------------------------------------
// Produtos
// -----------------------------------------------------------------------------


product = {name : 'Produto ' + random};

describe('POST /company/[id]/product/[id]/thumbnail', function () {

    before(function (done) {
        // cria produto
        api.post('companies', '/company/' + company.slug + '/product', {
            token : user.token,
            name : product.name
        }, function(error, data, response) {
            product = data;
            if (error) return done(error);
            else done();
        });
    });
    it('não envia imagem', function (done) {
        api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
            {
                token : user.token
            },
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('token errado', function(done) {
        api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
            {
                token : 'asd8vc89vc7vcx89fas872gjhibas'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('envia imagem de produto', function(done) {
        api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
            {
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data, 'não retornou dado nenhum');
                    should.not.exist(data.error, 'erro indesejado');
                    (data && data.original && data.original.url ? data.original.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
                    (data && data.small && data.small.url ? data.small.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
                    (data && data.medium && data.medium.url ? data.medium.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
                    (data && data.large && data.large.url ? data.large.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
                    product.thumbnail = data;
                    done();
                }
            }
        );
    });
    it('envia mesma imagem de produto', function (done) {
        api.file('companies', '/company/' + company.slug + '/product/' + product._id + '/thumbnail',
            {
                token : user.token
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    response.should.have.status(200);
                    should.exist(data, 'não retornou dado nenhum');
                    should.not.exist(data.error, 'erro indesejado');
                    (data && data.original && data.original.url ? data.original.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/original\..+$/, 'não salvou o original corretamente');
                    (data && data.small && data.small.url ? data.small.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/small\..+$/, 'não salvou o small corretamente');
                    (data && data.medium && data.medium.url ? data.medium.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/medium\..+$/, 'não salvou o medium corretamente');
                    (data && data.large && data.large.url ? data.large.url : '')
                        .should.match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/thumbnails\/.+\/large\..+$/, 'não salvou o large corretamente');
                    product.thumbnail.original.url.should.not.equal(data && data.original && data.large.url ? data.original.url : '', 'as urls deveriam ser diferentes');
                    product.thumbnail = data;
                    done();
                }
            }
        );
    });
});


describe('GET /company/:company_id/product/:product_id/thumbnail', function () {

    before( function (done){
        // cria produto sem thumbnail
        api.post('companies', '/company/' + company.slug + '/product', {
            token : user.token,
            name : product.name+'b'
        }, function(error, data, response) {
            if (error) return done(error);
            product2 = data;
            done();
        });
    })

    it('empresa não existe', function (done) {
        api.get('companies', '/company/asddasddaoiheoins/product/'+product.slug+'/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            data.should.have.property('error');
            done();
        });
    });
    it('produto não existe', function (done) {
        api.get('companies', '/company/' + company.slug + '/product/dasdasdassadsaddsa/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            data.should.have.property('error');
            done();
        });
    });
    it('produto com thumbnail', function (done) {
        api.get('companies', '/company/' + company.slug + '/product/' + product.slug + '/thumbnail', {}, function (error, data, response) {
            if (error) return done(error);
            should.exist(data);
            data.should.not.have.property('error');
            data.should.have.property('original').with.property('url', product.thumbnail.original.url);
            data.should.have.property('small').with.property('url', product.thumbnail.small.url);
            data.should.have.property('medium').with.property('url', product.thumbnail.medium.url);
            data.should.have.property('large').with.property('url', product.thumbnail.large.url);
            done();
        });
    });
    it('produto sem thumbnail', function (done) {
        api.get('companies', '/company/' + company.slug + '/product/'+product2.slug+'/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data, 'deveria retornar undefined')
            done();
        });
    });
});


describe('GET /company/:company_id/product/:product_id/thumbnail/:size', function() {
    it('url existe', function (done) {
        api.get('companies', '/company/fassafsafassad/product/afasdasdas/thumbnail/daoishoihe', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('empresa não existe', function (done) {
        api.get('companies', '/company/fassafsafassad/product/afasdasdas/thumbnail/daoishoihe', {}, function(error, data, response) {
            if (error) return done(error);
            should.exist(data.error, 'tem que retornar erro');
            done();
        });
    });
    it('produto não existe', function (done) {
        api.get('companies', '/company/'+company.slug+'/product/afasdasdas/thumbnail/daoishoihe', {}, function(error, data, response) {
            if (error) return done(error);
            should.exist(data.error, 'tem que retornar erro');
            done();
        });
    });
    it('pega tamanho medio', function (done) {
        api.get('companies', '/company/'+company.slug+'/product/'+product.slug+'/thumbnail/medium', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data.error, 'não pode retornar erro');
            (product.thumbnail.medium.url).should.equal(data.url);
            done();
        });
    });
    it('tamanho qualquer retorna small', function (done) {
        api.get('companies', '/company/'+company.slug+'/product/'+product.slug+'/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data.error, 'não pode retornar erro');
            (product.thumbnail.small.url).should.equal(data.url);
            done();
        });
    });
    it('produto sem thumbnail', function (done) {
        api.get('companies', '/company/'+company.slug+'/product/'+product2.slug+'/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
            if (error) return done(error);
            should.not.exist(data, 'deve retornar vazio');
            done();
        });
    });
});


describe('DEL /company/:company_id/product/:product_id/thumbnail', function() {
    it('url existe', function (done) {
        api.del('companies', '/company/dasdsadsa/product/asdsdasadsad/thumbnail', {}, function(error, data, response) {
            if (error) return done(error);
            response.should.have.status(200);
            should.exist(data, 'não retornou dado nenhum');
            done();
        });
    });
    it('token invalido', function (done) {
        api.del('companies', '/company/'+company.slug+'/product/'+product.slug+'/thumbnail',
            {},
            function(error, data, response) {
                if (error) return done(error);
                should.exist(data.error, 'tem que retornar erro');
                done();
            }
        );
    });
    it('remove com sucesso', function (done) {
        api.del('companies', '/company/'+company.slug+'/product/'+product.slug+'/thumbnail',
            { token : user.token },
            function(error, data, response) {
                if (error) return done(error);
                should.not.exist(data, 'deve retornar vazio');
                api.get('companies', '/company/'+company.slug+'/product/'+product.slug+'/thumbnail/fasfsafsasfafas', {}, function(error, data, response) {
                    should.not.exist(data, 'deve retornar vazio (get)');
                    done();
                });
            }
        );
    });
});