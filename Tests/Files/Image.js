/** Tests Files.Image
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Image do serviço Files.
 * O exemplo usado é o vader.jpg, onde height > width
 */

var should = require("should"),
    api = require("../Utils.js").api,
    db = require("../Utils.js").db,
    rand = require("../Utils.js").rand,
    imagemagick = require('imagemagick'),
    path, tmpfolder, image,
    h200extend, w200extend, w200h200extend, h200fit, w200fit, w200h200fit;

path = '/testes/images/'+rand()+'/wow/';
tmpfolder = '/tmp/eeimagestest/'+rand()+'/'

describe('POST /image', function() {
    it('não define path', function(done) {
        api.file('files', '/image',
            {},
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('não define imagem', function(done) {
        api.file('files', '/image',
            {
                path : path
            },
            {},
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('salva imagem', function(done) {
        api.file('files', '/image',
            {
                path : path
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url').with.include(path);
                    image = data;
                    done();
                }
            }
        );
    });
    it('salva mesma imagem', function(done) {
        api.file('files', '/image',
            {
                path : path
            },
            {
                file : 'vader.jpg'
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.should.not.equal(image.url);
                    done();
                }
            }
        );
    });
})


describe('POST /image/resize', function() {
    it('não define path', function(done) {
        api.post('files', '/image/resize',
            {
                width: 200,
                height: 200
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('não define dimensões', function(done) {
        api.post('files', '/image/resize',
            {
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    should.exist(data.error, 'não retornou erro');
                    done();
                }
            }
        );
    });
    it('resizeia imagem só com altura', function(done) {
        api.post('files', '/image/resize',
            {
                height : 200,
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('h200')
                        .and.include('extend');
                    h200extend = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem só com largura', function(done) {
        api.post('files', '/image/resize',
            {
                width : 200,
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('w200')
                        .and.include('extend');
                    w200extend = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem com altura e largura', function(done) {
        api.post('files', '/image/resize',
            {
                width : 200,
                height : 200,
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('w200')
                        .and.include('h200')
                        .and.include('extend');
                    w200h200extend = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem com fit e largura', function(done) {
        api.post('files', '/image/resize',
            {
                width : 200,
                style : 'fit',
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('w200')
                        .and.include('fit');
                    w200fit = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem com fit e altura', function(done) {
        api.post('files', '/image/resize',
            {
                height : 200,
                style : 'fit',
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('h200')
                        .and.include('fit');
                    h200fit = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem com fit', function(done) {
        api.post('files', '/image/resize',
            {
                height : 200,
                width : 200,
                style : 'fit',
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('w200')
                        .and.include('h200')
                        .and.include('fit');
                    w200h200fit = data;
                    done();
                }
            }
        );
    });
    it('resizeia imagem com label', function(done) {
        api.post('files', '/image/resize',
            {
                height : 200,
                width : 200,
                label : 'labeltestando',
                path : image.path
            },
            function(error, data, response) {
                if (error) done(error);
                else {
                    should.exist(data, 'não retornou dado nenhum');
                    data.should.have.property('url')
                        .with.include(path)
                        .and.include('labeltestando');
                    done();
                }
            }
        );
    });
})


describe('Verificação dos resizeamentos', function() {
    it ('w200extend', function (done) {
        imagemagick.identify(w200extend.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').equal(200);
                features.should.have.property('height').equal(200);
                done();
            }
        });
    });
    it ('h200extend', function (done) {
        imagemagick.identify(h200extend.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').equal(200);
                features.should.have.property('height').equal(200);
                done();
            }
        });
    });
    it ('w200h200extend', function (done) {
        imagemagick.identify(w200h200extend.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').equal(200);
                features.should.have.property('height').equal(200);
                done();
            }
        });
    });
    it ('w200fit', function (done) {
        imagemagick.identify(w200fit.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').below(201);
                features.should.have.property('height').below(201);
                done();
            }
        });
    });
    it ('h200fit', function (done) {
        imagemagick.identify(h200fit.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').below(201);
                features.should.have.property('height').below(201);
                done();
            }
        });
    });
    it ('w200h200fit', function (done) {
        imagemagick.identify(w200h200fit.fullPath, function (error, features) {
            if (error) done(error);
            else {
                features.should.have.property('width').below(201);
                features.should.have.property('width').below(201);
                done();
            }
        });
    });
});