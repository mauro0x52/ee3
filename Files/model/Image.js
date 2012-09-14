/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Manipulacao de imagens
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    imageSchema,
    Image;

imageSchema = new Schema({
    path        : {type : String, trim : true, required : true},
    url         : {type : String, trim : true}
});

/** Save
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Salva imagem no filesystem
 */
imageSchema.methods.save = function (cb) {
    "use strict";

    var
    // modulos
        fs = require('fs'),
        knox = require('knox'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
    // atributos
        file = this.toJSON().file,
        path = this.path,
    // variaveis
        fullPath, folderPath, s3Client;

    // tira barras duplicadas
    while (path.indexOf('//') !== -1) {
        path = path.replace('//', '/');
    }
    this.path = path;

    // tem algum arquivo?
    if (!file) {
        cb({message : 'no defined file', name : 'ValidationError', errors : {file : {message : 'no defined file', name : 'ValidatorError', path : 'file', type : 'required'}}}, undefined);
    } else {
        // foi definido o caminho?
        if (!path) {
            cb({message : 'no defined path', name : 'ValidationError', errors : { path : {message : 'no defined path', name : 'ValidatorError', path : 'path', type : 'required'}}}, undefined);
        } else {
            // tamanho muito grande?
            if (file.size > config.files.maxsize) {
                cb({message : 'max file size exceeded ('+config.files.maxsize+')', name : 'ValidationError', errors : { file : {message : 'max file size exceeded ('+config.files.maxsize+')', name : 'ValidatorError', path : 'path', type : 'max'}}}, undefined);
            } else {
                if (config.aws.s3.enabled) {
                    // ----------------------------------------
                    // salva na aws s3

                    s3Client = knox.createClient({
                        key: config.aws.key,
                        secret: config.aws.secret,
                        bucket: config.aws.s3.bucket
                    });

                    s3Client.putFile(file.path, path, function (error, response) {
                        if (200 !== response.statusCode) {
                            cb({message : 'error saving image', name : 'ServerError'}, undefined);
                        } else {
                            cb(undefined, new Image({path: file.path}), path);
                        }
                    });

                    // ----------------------------------------
                } else {
                    // ----------------------------------------
                    // salva no filesystem

                    fullPath = config.files.folder + '/' + path;
                    // tira barras duplicadas
                    while (fullPath.indexOf('//') !== -1) {
                        fullPath = fullPath.replace('//', '/');
                    }

                    // arquivo ja existe?
                    fs.exists(fullPath, function (exists) {
                        if (exists) {
                            cb({message : 'path already exists', name : 'ValidationError', errors : { path : {message : 'path already exists', name : 'ValidatorError', path : 'path', type : 'unique'}}}, undefined);
                        } else {
                            // cria diretorio
                            folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
                            new File(folderPath).createDirectory(function () {

                                // salva arquivo
                                fs.rename(
                                    file.path,
                                    fullPath,
                                    function (error) {
                                        if (error) {
                                            cb({message : 'error saving image', name : 'ServerError'}, undefined);
                                        } else {
                                            cb(undefined, new Image({path: fullPath}), path);
                                        }
                                    }
                                );
                            });
                        }
                    });
                    // salva no filesystem
                    // ----------------------------------------
                }
            }
        }
    }
};

/** Open
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Abre uma imagem num arquivo temporario
 */
imageSchema.statics.open = function (path, cb) {
    "use strict";

    var
    // modulos
        fs = require('fs'),
        url = require('url'),
        http = require('http'),
        knox = require('knox'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
    // variaveis
        image, fileFullPath, fileUrl, options, fileName, fileStream, folderPath;

    // ----------------------------------------
    // abre imagem do s3 na pasta temporaria
    if (config.aws.s3.enabled) {
        fileUrl = config.aws.s3.bucket + '.s3.amazonaws.com/' + path;

        while (fileUrl.indexOf('//') !== -1) {
            fileUrl = fileUrl.replace('//', '/');
        }
        fileUrl = 'http://' + fileUrl;

        options = {
            host: url.parse(fileUrl).host,
            port: 80,
            path: url.parse(fileUrl).pathname
        };

        fileFullPath = config.files.temp + '/' + path;
        while (fileFullPath.indexOf('//') !== -1) {
            fileFullPath = fileFullPath.replace('//', '/');
        }
        folderPath = fileFullPath.substring(0, fileFullPath.lastIndexOf("/"));

        // cria diretorio temporario
        new File(folderPath).createDirectory(function () {
            fileName = url.parse(fileUrl).pathname.split('/').pop();

            // requisita o arquivo
            http.get(options, function (response) {
                response.setEncoding('binary');
                fileStream = '';
                // junta os chuncks
                response.on('data', function (data) {
                    fileStream += data;
                });
                // salva a porratoda
                response.on('end', function () {
                    fs.writeFile(fileFullPath, fileStream, 'binary', function (error) {
                        if (error) {
                            cb({message : 'error reading image', name : 'ServerError'}, undefined);
                        } else {
                            cb(undefined, new Image({path: fileFullPath}));
                        }
                    });
                });
            });
        });
        // ----------------------------------------
    } else {
        // ----------------------------------------
        // abre imagem da máquina local
        fileFullPath = config.files.folder + '/' + path;
        while (fileFullPath.indexOf('//') !== -1) {
            fileFullPath = fileFullPath.replace('//', '/');
        }
        new File(fileFullPath).isFile(function (error, isFile) {
            if (error) {
                cb(error, undefined);
            } else {
                cb(undefined, new Image({path: fileFullPath}));
            }
        });
        // ----------------------------------------
    }
};

/** Resize
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Cria um arquivo temporário resizeado
 */
imageSchema.statics.resize = function (params, cb) {
    "use strict";

    var
    // modulos
        imagemagick = require('imagemagick'),
        fs = require('fs'),
        path = require('path'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
    // parametros
        style  = params.style || 'extend',
        width  = params.width || undefined,
        height = params.height || undefined,
        label  = params.label || null,
        image = params.image,
    // variaveis
        filePath, folderPath, fullFilePath, fullFolderPath,
        originalImage, originalFullFilePath, fileNameSplit, fileExt,
        original_width, original_height, original_aspect, aspect,
        resizeImageProperties = {};

    // constroi label, caso nao tenha passado
    if (!label) {
        label = style;
        if (width) {
            label += '_w' + width;
        }
        if (height) {
            label += '_h' + height;
        }
    }

    if (!width || !height) {
        if (height) {
            width = height;
        } else {
            height = width;
        }
    }

    originalFullFilePath = image.path;

    // extensao do arquivo
    fileNameSplit = path.extname(originalFullFilePath || '').split('.');
    fileExt = fileNameSplit[fileNameSplit.length - 1];

    // caminho relativo do novo arquivo
    filePath = originalFullFilePath;
    filePath = filePath.replace(config.files.folder, '/');
    filePath = filePath.replace(config.files.temp, '/');
    filePath = filePath.substring(0, filePath.lastIndexOf("/")) + '/' + label + '.' + fileExt;

    fullFilePath = config.files.temp + filePath;

    while (filePath.indexOf('//') !== -1) {
        filePath = filePath.replace('//', '/');
    }

    while (fullFilePath.indexOf('//') !== -1) {
        fullFilePath = fullFilePath.replace('//', '/');
    }

    // pasta do novo arquivo
    folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
    fullFolderPath = config.files.temp + folderPath;

    fs.readFile(originalFullFilePath, 'binary', function (error, originalImage) {
        if (error) {
            cb(error);
        } else {
            if (style === 'fit') {
                // ----------------------------------------
                // fit = nao corta a imagem
                var imageProperties = {};
                imageProperties.srcData = originalImage;

                if (width) {
                    imageProperties.width = width;
                }
                if (height) {
                    imageProperties.height = height;
                }

                imagemagick.resize(imageProperties, function (error, stdout, stderr) {
                    if (error) {
                        cb(error, undefined);
                    } else {
                        new File(fullFolderPath).createDirectory(function () {
                            fs.writeFile(fullFilePath, stdout, 'binary', function (error) {
                                if (error) {
                                    cb(error);
                                } else {
                                    cb(undefined, new Image({path: fullFilePath}), filePath);
                                }
                            });
                        });
                    }
                });
                // ----------------------------------------
            } else {
                // ----------------------------------------
                // extend = pode cortar a imagem
                imagemagick.identify(originalFullFilePath, function (err, features) {
                    if (error) {
                        cb(error)
                    } else {
                        original_width = features.width;
                        original_height = features.height;
                        original_aspect = original_width / original_height;

                        aspect = width / height;

                        resizeImageProperties = {};
                        resizeImageProperties.srcData = originalImage;

                        if (original_aspect >= aspect) {
                            // extended + o original eh mais achatado que o desejado
                            resizeImageProperties.width = width;
                            imagemagick.resize(resizeImageProperties, function (error, stdout, stderr) {
                                if (error) {
                                    cb(error, undefined, undefined);
                                } else {
                                    new File(fullFolderPath).createDirectory(function () {
                                        fs.writeFile(fullFilePath, stdout, 'binary', function (error) {
                                            if (error) {
                                                cb(error, undefined, undefined);
                                            } else {
                                                var cropImageProperties = {};
                                                cropImageProperties.srcPath = fullFilePath;
                                                cropImageProperties.dstPath = fullFilePath;
                                                if (width) {
                                                    cropImageProperties.width = width;
                                                }
                                                if (height) {
                                                    cropImageProperties.height = height;
                                                }
                                                imagemagick.crop(cropImageProperties, function (err, stdout, stderr) {
                                                    if (error) {
                                                        cb(error, undefined, undefined);
                                                    } else {
                                                        cb(undefined, new Image({path: fullFilePath}), filePath);
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        } else {
                            // extended + o original eh mais alto que o desejado
                            resizeImageProperties.height = height;
                            imagemagick.resize(resizeImageProperties, function (error, stdout, stderr) {
                                if (error) {
                                    cb(error, undefined, undefined);
                                } else {
                                    new File(fullFolderPath).createDirectory(function () {
                                        fs.writeFile(fullFilePath, stdout, 'binary', function (error) {
                                            if (error) {
                                                cb(error, undefined, undefined);
                                            } else {
                                                var cropImageProperties = {};
                                                cropImageProperties.srcPath = fullFilePath;
                                                cropImageProperties.dstPath = fullFilePath;
                                                if (width) {
                                                    cropImageProperties.width = width;
                                                }
                                                if (height) {
                                                    cropImageProperties.height = height;
                                                }
                                                imagemagick.crop(cropImageProperties, function (error, stdout, stderr) {
                                                    if (error) {
                                                        cb(error, undefined, undefined);
                                                    } else {
                                                        cb(undefined, new Image({path: fullFilePath}), filePath);
                                                    }
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
                // ----------------------------------------
            }
        }
    });
};


/*  Exportando o pacote  */
Image = exports.Image = mongoose.model('Images', imageSchema);
