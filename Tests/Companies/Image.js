/** Testes  Companies.Image
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Image do serviço Companies
 */

var should = require("should"),
    api = require("../Utils.js").api,
    rand = require("../Utils.js").rand,
    userA, companyA, productA, imageA, productA2, userB, companyB;


random = rand();
userA = {username : 'testes+' + random + '@empreendemia.com.br'};
userB = {username : 'testes+' + random + 'B@empreendemia.com.br'};

describe('POST /company/:company_slug/product/:product_slug/image', function() {

    before(function(done) {
        var saveAll = 0;
        // cria usuario A
        api.post('auth', '/user', {
            username : userA.username,
            password : 'testando',
            password_confirmation : 'testando'
        }, function(error, data) {
            userA.token = data.token;
            // cria empresa
            api.post('companies', '/company', {
                token : userA.token,
                name : 'Empresa '+random,
                activity : 'consultoria em testes',
                type : 'company',
                profile : 'both',
                active : true
            }, function(error, data) {
                companyA = data;
                api.post('companies', '/company/' + companyA.slug + '/product',
                    {
                        token : userA.token,
                        name : 'Um produto ' + random
                    },
                    function(error, data, response) {
                        productA = data;
                        api.post('companies', '/company/' + companyA.slug + '/product',
                        {
                            token : userA.token,
                            name : 'Outro produto' + random
                        },
                        function(error, data, response) {
                            productA2 = data;
                            // cria usuario B
                            api.post('auth', '/user', {
                                username : userB.username,
                                password : 'testando',
                                password_confirmation : 'testando'
                            }, function(error, data) {
                                userB.token = data.token;
                               // cria empresa
                               api.post('companies', '/company', {
                                   token : userB.token,
                                   name : 'Empresa '+random,
                                   activity : 'consultoria em testes',
                                   type : 'company',
                                   profile : 'both',
                                   active : true
                               }, function(error, data) {
                                   companyB = data;
                                   done();
                               });
                            });
                        }
                    );
                    }
                );
                
            });
        });
    })

    it('url existe', function(done) {
        api.file('companies', '/company/asfdhjgpoinhpoaejr/product/asdiaubfas/image',
            {
                token : userA.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    should.exist(response);
                    response.should.have.status(200);
                    should.exist(data);
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('token inválido', function(done) {
        api.file('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image',
            {
                token : 'aiusbdiuhg19082y3re98sfdyhx',
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('empresa não existe', function(done) {
        api.file('companies', '/company/sdfinoi2o3i54hrtefdsv/product/' + productA.slug + '/image',
            {
                token : userA.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('empresa sem produtos', function(done) {
        api.file('companies', '/company/' + companyB.slug + '/product/asdfoi3esfd/image',
            {
                token : userB.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            }, function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('produto não existe', function(done) {
        api.file('companies', '/company/' + companyA.slug + '/product/asdfpvongop23jrpofsd/image',
            {
                token : userA.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('empresa de outro usuário', function(done) {
        api.file('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image',
            {
                token : userB.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('não escolhe imagem', function(done) {
        api.file('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image',
            {
                token : userA.token,
                title : 'Título da imagem',
                legend : 'Legenda da imagem'
            },
            {},
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.have.property('error');
                    done();
                }
            }
        );
    });
    it('envia imagem', function(done) {
        api.file('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image',
            {
                token : userA.token,
                title : 'Titulo da imagem',
                legend : 'Legenda da imagem'
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) return done(error);
                else {
                    data.should.not.have.property('error');
                    data.should.have.property('url')
                        .match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/images\/.+\/original\..+$/);
                    data.should.have.property('_id');
                    data.should.have.property('file');
                    data.should.have.property('title').equal('Titulo da imagem');
                    data.should.have.property('legend').equal('Legenda da imagem');
                    imageA = data;
                    done();
                }
            }
        );
    });
});

describe('GET /company/:company_slug/product/:product_slug/images', function() {
    before(function(done) {
        var countImages = 0;
        for (var i = 0; i < 10; i++) {
            api.file('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image',
                {
                    token : userA.token,
                    title : 'Titulo da imagem',
                    legend : 'Legenda da imagem'
                },
                {
                    file : 'vader.jpg'
                },
                function(error, data, response) {
                    countImages++;
                    if (countImages === 10) done();
                }
            );
        }
    })

    it('url existe', function(done) {
        api.get('companies', '/company/sdfinoi2o3i54hrtefdsv/product/' + productA.slug + '/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(response);
                response.should.have.status(200);
                should.exist(data);
                done();
            }
        });
    });
    it('empresa não existe', function(done) {
        api.get('companies', '/company/sdfinoi2o3i54hrtefdsv/product/' + productA.slug + '/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não existe', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/ngpbfonpoaisder90/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produtos', function(done) {
        api.get('companies', '/company/' + companyB.slug + '/product/ngpbfonpoaisder90/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto sem imagens', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/' + productA2.slug + '/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data);
                done();
            }
        });
    });
    it('lista de imagens', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/images', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.be.an.instanceOf(Array);
                data.length.should.be.above(10);
                for (var i = 0; i < data.length; i++) {
                    data[i].should.have.property('url')
                        .match(/^http\:\/\/.+\/companies\/.+\/products\/.+\/images\/.+\/original\..+$/);
                    data[i].should.have.property('_id');
                    data[i].should.have.property('file');
                    data[i].should.have.property('title');
                    data[i].should.have.property('legend');
                }
                done();
            }
        });
    });
});

describe('GET /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe', function(done) {
        api.get('companies', '/company/sdfinoi2o3i54hrtefdsv/product/afsdf2w34sdvc/image/sadio12h3ansd', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(response);
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não existe', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/dsafwefsdfb/image/sadio12h3ansd', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produtos', function(done) {
        api.get('companies', '/company/' + companyB.slug + '/product/dsafwefsdfb/image/asdfxvcoin', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto sem imagens', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/' + productA2.slug + '/image/adsfvnowier', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('imagem não existe', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/adsfvnowier', {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('dados da imagens', function(done) {
        api.get('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {}, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('url').equal(imageA.url);
                data.should.have.property('_id').equal(imageA._id);
                data.should.have.property('file').equal(imageA.file);
                data.should.have.property('title').equal(imageA.title);
                data.should.have.property('legend').equal(imageA.legend);
                done();
            }
        });
    });
});

describe('PUT /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe', function(done) {
        api.put('companies', '/company/sdfinoi2o3i54hrtefdsv/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userA.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(response);
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não existe', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userA.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produtos', function(done) {
        api.put('companies', '/company/' + companyB.slug + '/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userB.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto sem imagens', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/' + productA2.slug + '/image/sadio12h3ansd', {
            token : userA.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('imagem não existe', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/sadio12h3ansd', {
            token : userA.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : 'asd9f0vb901h2nlkendfzx',
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('outro usuário', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : userB.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('edita dados da imagem', function(done) {
        api.put('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : userA.token,
            title : 'Atualizando titulo',
            legend : 'Atualizando legenda'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.not.have.property('error');
                data.should.have.property('_id').equal(imageA._id);
                data.should.have.property('file').equal(imageA.file);
                data.should.have.property('title').equal('Atualizando titulo');
                data.should.have.property('legend').equal('Atualizando legenda');
                api.get('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {}, function(error, data, response) {
                    if (error) return done(error);
                    else {
                        data.should.not.have.property('error');
                        data.should.have.property('_id').equal(imageA._id);
                        data.should.have.property('file').equal(imageA.file);
                        data.should.have.property('title').equal('Atualizando titulo');
                        data.should.have.property('legend').equal('Atualizando legenda');
                        done();
                    }
                });
            }
        });
    });
});

describe('DEL /company/:company_slug/product/:product_slug/image/:id', function() {
    it('empresa não existe', function(done) {
        api.del('companies', '/company/sdfinoi2o3i54hrtefdsv/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.exist(response);
                response.should.have.status(200);
                should.exist(data);
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto não existe', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('empresa sem produtos', function(done) {
        api.del('companies', '/company/' + companyB.slug + '/product/afsdf2w34sdvc/image/sadio12h3ansd', {
            token : userB.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('produto sem imagens', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/' + productA2.slug + '/image/sadio12h3ansd', {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('imagem não existe', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/sadio12h3ansd', {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('token inválido', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : 'asd9f0vb901h2nlkendfzx'
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('outro usuário', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : userB.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                data.should.have.property('error');
                done();
            }
        });
    });
    it('remove dados da imagem', function(done) {
        api.del('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {
            token : userA.token
        }, function(error, data, response) {
            if (error) return done(error);
            else {
                should.not.exist(data);
                api.get('companies', '/company/' + companyA.slug + '/product/' + productA.slug + '/image/' + imageA._id, {}, function(error, data, response) {
                    if (error) return done(error);
                    else {
                        data.should.have.property('error');
                        done();
                    }
                });
            }
        });
    });
});
