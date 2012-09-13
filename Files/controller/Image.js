/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de imagens
 */

module.exports = function (app) {
    "use strict";

    var
    // models
        Model = require('./../model/Model.js'),
        Image  = Model.Image,
        File = Model.File,
    // arquivo de configuracao
        config  = require('../config.js');

    app.post('/image', function (request, response) {
        var
        // modulos
            crypto = require('crypto'),
            path = require('path'),
            dateUtils = require('date-utils'),
        // variaveis
            image, tmpFile, imageFile, hash, folder, folderPath, fileNameSplit, fileExt, filePath;

        response.contentType('json');

        folderPath = request.param('path');

        if (!folderPath) {
            response.send({error : {message : 'no defined path', name : 'ValidationError', errors : {path : {message : 'no defined path', name : 'ValidatorError', path : 'path', type : 'required'}}}});
        } else {
            // caminho escolhido
            folderPath = request.param('path', null);

            if (!request.files || !request.files.file) {
                response.send({error : {message : 'no selected file', name : 'ValidationError', errors : {file : {message : 'no selected file', name : 'ValidatorError', path : 'file', type : 'required'}}}});
            } else {
                // arquivo da imagem temporaria
                tmpFile = request.files.file;

                // extensao do arquivo
                fileNameSplit = path.extname(request.files.file.name || '').split('.');
                fileExt = fileNameSplit[fileNameSplit.length - 1];

                // nome unico para a pasta: ANO + MES + DIA + hash[10]
                hash = crypto.createHash('md5').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
                folder = Date.today().toFormat('YYYYMMDD') + hash;

                // caminho do arquivo
                filePath = folderPath + '/' + folder + '/original.' + fileExt;

                // salva a imagem no filesystem
                image = new Image({
                    path : filePath,
                    file : tmpFile
                });

                image.save(function (error, image, imagePath) {
                    if (error) {
                        response.send({error: error});
                    } else {
                        // salva informacoes da imagem no bd
                        var file = new File({
                            type : 'image',
                            path : imagePath
                        });

                        file.save(function (error, file) {
                            if (error) {
                                response.send({error: error});
                            } else {
                                response.send({image : file});
                            }
                        });
                    }
                });
            }

        }

    });

    app.post('/image/resize', function (request, response) {
        var
        // modulos
            crypto = require('crypto'),
        // parametros
            fileId = request.param('file', null),
            width = request.param('width', null),
            height = request.param('height', null),
            style = request.param('style', null),
            label = request.param('label', null),
        // variaveis
            image, newImage;

        response.contentType('json');

        if (!fileId) {
            response.send({error : {message : 'no defined file', name : 'ValidationError', errors : {file : {message : 'no defined file', name : 'ValidatorError', path : 'file', type : 'required'}}}});
        } else {
            if (!width && !height) {
                response.send({error : {message : 'no defined dimensions', name : 'ValidationError', errors : {width : {message : 'no defined dimensions', name : 'ValidatorError', path : 'path', type : 'required',height : {message : 'no defined dimensions', name : 'ValidatorError', path : 'height', type : 'required'}}}}})
            } else {
                // le dados da imagem
                File.findByIdentity(fileId, function (error, file) {
                    // abre a imagem
                    Image.open(file.path, function (error, imageFile) {
                        if (error) {
                            response.send({error: error});
                        } else {
                            // cria uma imagem temporaria resizeada
                            Image.resize(
                                {
                                    style   :   style,
                                    width   :   width,
                                    height  :   height,
                                    label   :   label,
                                    image   :   imageFile
                                },
                                function (error, tmpFile, newFilePath) {
                                    // salva a imagem no filesystem
                                    newImage = new Image({
                                        path : newFilePath,
                                        file : tmpFile
                                    });

                                    newImage.save(function (error, image) {
                                        if (error) {
                                            response.send({error: error});
                                        } else {
                                            // salva informacoes da imagem no bd
                                            var file = new File({
                                                type : 'image',
                                                path : newFilePath
                                            });

                                            file.save(function (error, file) {
                                                if (error) {
                                                    response.send({error: error});
                                                } else {
                                                    response.send({image : file});
                                                }
                                            });
                                        }
                                    });
                                }
                            );
                        }
                    });
                });
            }
        }
    });

    app.get('/image/*', function (request, response) {
        var
        // modulos
            url = require('url'),
        // parametros
            fileId = request.params[0];


        if (!fileId) {
            response.send({error : { message : 'image not found', name : 'NotFoundError', id : '', model : 'image'}});
        } else {
            File.findByIdentity(fileId, function (error, file) {
                if (error) {
                    response.send(error);
                } else {
                    if (!file) {
                        response.send({error: fileId + " não foi encontrado"});
                    } else {
                        response.send({image : file});
                    }
                }
            });
        }
    });

};