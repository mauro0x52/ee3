/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de imagens
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        Image  = Model.Image,
        File = Model.File;

    var config  = require('../config.js');


    app.post('/image', function (request,response) {
        var
        // modulos
            crypto = require('crypto'),
            path = require('path'),
            dateUtils = require('date-utils'),
        // variaveis
            tmpFile, imageFile, hash, folder, folderPath, fileNameSplit, fileExt, filePath;

        response.contentType('json');

        // caminho escolhido
        folderPath = request.param('path', null);

        // arquivo da imagem temporaria
        tmpFile = request.files.file;

        // extensao do arquivo
        fileNameSplit = path.extname(request.files.file.name||'').split('.');
        fileExt = fileNameSplit[fileNameSplit.length - 1];

        // nome unico para a pasta: ANO + MES + DIA + hash[10]
        hash = crypto.createHash('md5').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
        folder = Date.today().toFormat('YYYYMMDD') + hash;

        // caminho do arquivo    
        filePath = folderPath + '/' + folder + '/original.' + fileExt;

        // salva a imagem no filesystem
        image = new Image({
            path : filePath
        });

        image.save(function(error, image) {
            if (error) {
                console.log(error);
            }
            else {
                // salva informacoes da imagem no bd
                var file = new File({
                    type : 'image',
                    path : image.path
                });

                file.save(function(error, file){
                    if (error) {
                        console.log(error);
                    }
                    else {

                    }
                });
            }
        });

    });


    app.put('/image/resize', function (request,response) {
        var 
        // modulos
            crypto = require('crypto'),
        // parametros 
            filePath = request.param('path', null),
            width = request.param('width', null),
            height = request.param('height', null),
            style = request.param('style', null),
            label = request.param('label', null),
        // variaveis 
            image, filePath;

        response.contentType('json');

        // abre a imagem
        Image.open({ path : filePath }, function (error, file) {
            if (error) {

            }
            else {
                // cria uma imagem temporaria resizeada
                Image.resize(
                    {
                        style:style, 
                        width:width, 
                        height:height, 
                        label:label
                    },
                    function(error, tmpFile){
                        // salva a imagem no filesystem
                        image = new Image({
                            path : tmpFile
                        });

                        image.save(function(error, image) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                // salva informacoes da imagem no bd
                                var file = new File({
                                    type : 'image',
                                    path : image.path
                                });

                                file.save(function(error, file){
                                    if (error) {
                                        console.log(error);
                                    }
                                    else {

                                    }
                                });
                            }
                        });
                    }
                );
            }
        });

    });

};
