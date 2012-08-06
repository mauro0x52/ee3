/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Manipulacao de imagens 
 */
 
var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    imageSchema;

imageSchema = new schema({
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
        fullPath, folderPath;

    // tira barras duplicadas
    while (path.indexOf('//') != -1) {
 		path = path.replace('//', '/');
	}
    this.path = path;

    // tem algum arquivo?
    if (!file) {
        cb('Arquivo de imagem é obrigatório', undefined);
    } 
    else {
        // foi definido o caminho?
        if (!path) {
            cb('Caminho não definido', undefined);
        }
        else {
            // tamanho muito grande?
            if (file.size > config.files.maxsize) {
                cb('Tamanho máximo excedido', undefined);
            }
            else {
                // ----------------------------------------
                // salva na aws s3

                if (config.aws.s3.enabled) {
                    var s3Client = knox.createClient({
                        key: config.aws.key,
                        secret: config.aws.secret,
                        bucket: config.aws.s3.bucket
                    });

                    s3Client.putFile(file.path, path, function(error, response) {
                        if (200 != response.statusCode) {
                            cb('Ocorreu algum erro ao salvar imagem', undefined);
                        }
                        else {
                            cb(undefined, new Image({path:file.path}), path); 
                        }
                    });
                }
                // ----------------------------------------

                // ----------------------------------------
                // salva no filesystem

                else {
                    fullPath = config.files.folder + '/' + path;
                    // tira barras duplicadas
                    while (fullPath.indexOf('//') != -1) {
                 		fullPath = fullPath.replace('//', '/');
                    }

                    // arquivo ja existe?
                    fs.exists(fullPath, function(exists) {
                        if (exists) {
                            cb('Arquivo com nome "'+path+'" já existe', undefined);
                        }
                        else {
                            // cria diretorio
                            folderPath = fullPath.substring(0, fullPath.lastIndexOf("/"));
                            new File(folderPath).createDirectory(function() {
    
                                // salva arquivo
                                fs.rename(
                                    file.path, 
                                    fullPath,
                                    function(error) {
                                        if (error) {
                                            cb('Ocorreu algum erro ao salvar imagem', undefined);
                                        }
                                        else {
                                            cb(undefined, new Image({path:fullPath}), path); 
                                        }
                                    }
                                );
                            });
                        }
                    });
                }
                // salva no filesystem
                // ----------------------------------------
            }
        }
    }
}



/** Open
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Abre uma imagem num arquivo temporario
 */
imageSchema.statics.open = function (path, cb) {
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
        fileUrl = config.aws.s3.bucket+'.s3.amazonaws.com/'+path;
        
        while (fileUrl.indexOf('//') != -1) {
            fileUrl = fileUrl.replace('//', '/');
        }
        fileUrl = 'http://'+fileUrl;
        
        
        options = {
            host: url.parse(fileUrl).host,
            port: 80,
            path: url.parse(fileUrl).pathname
        };
        
        fileFullPath = config.files.temp + '/' + path;
        while (fileFullPath.indexOf('//') != -1) {
            fileFullPath = fileFullPath.replace('//', '/');
        }
        folderPath = fileFullPath.substring(0, fileFullPath.lastIndexOf("/"));
        
        new File(folderPath).createDirectory(function() {
            fileName = url.parse(fileUrl).pathname.split('/').pop();
            
            http.get(options, function(response) {
                response.setEncoding('binary');
                fileStream = '';
                response.on('data', function(data) {
                    fileStream += data;
                });
                response.on('end', function() {
                    fs.writeFile(fileFullPath, fileStream, 'binary', function(error) {
                        if (error) {
                            cb('Erro ao ler imagem', undefined);
                        }
                        else {
                            cb(undefined, new Image({path:fileFullPath}));
                        }
                    });
                });
            });
         });
    }
    // ----------------------------------------

    // ----------------------------------------
    // abre imagem da máquina local
    else {
        fileFullPath = config.files.folder + '/' + path;
        while (fileFullPath.indexOf('//') != -1) {
     		fileFullPath = fileFullPath.replace('//', '/');
	    }
        new File(fileFullPath).isFile(function(error, isFile) {
            if (error) {
                cb(error, undefined);
            }
            else {
                cb(undefined, new Image({path:fileFullPath}));
            }
        });
    }
    // ----------------------------------------
};


/** Resize
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Cria um arquivo temporário resizeado
 */
imageSchema.statics.resize = function (params, cb) {
    var
    // modulos
        imagemagick = require('imagemagick'),
        fs = require('fs'),
        path = require('path'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
    // parametros
        style  = params.style ? params.style : 'extend',
        width  = params.width ? params.width : undefined,
        height = params.height ? params.height : undefined,
        label  = params.label ? params.label : null,
        image = params.image,
    // variaveis
        filePath, folderPath, fullFilePath, fullFolderPath, image,
        originalImage, originalFullFilePath, fileNameSplit, fileExt;

    // constroi label, caso nao tenha passado
    if (!label) {
        label = style;
        if (width) {
            label += '_w'+width;
        }
        if (height) {
            label += '_h'+height;
        }
    }

    if (width && height) {

    }
    else {
        if (height) width = height;
        else height = width;
    }

    originalFullFilePath = image.path;


    // extensao do arquivo
    fileNameSplit = path.extname(originalFullFilePath||'').split('.');
    fileExt = fileNameSplit[fileNameSplit.length - 1];

    // caminho relativo do novo arquivo
    filePath = originalFullFilePath;
    filePath = filePath.replace(config.files.folder, '/');
    filePath = filePath.replace(config.files.temp, '/');
    filePath = filePath.substring(0, filePath.lastIndexOf("/")) + '/' + label + '.' + fileExt;

    fullFilePath = config.files.temp + filePath;
       
    while (filePath.indexOf('//') != -1) {
 		filePath = filePath.replace('//', '/');
	}

    while (fullFilePath.indexOf('//') != -1) {
 		fullFilePath = fullFilePath.replace('//', '/');
	}

    // pasta do novo arquivo
    folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
    fullFolderPath = config.files.temp + folderPath;

    originalImage = fs.readFileSync(originalFullFilePath, 'binary');

    // fit = nao corta a imagem
    if (style == 'fit') {
        var imageProperties = {};
        imageProperties.srcData = originalImage;

        if (width) imageProperties.width = width;
        if (height) imageProperties.height = height;

        imagemagick.resize(imageProperties, function(error, stdout, stderr){
            if (error) {
                console.log(err);
            }
            else {
                new File(fullFolderPath).createDirectory(function() {
                    fs.writeFile(fullFilePath, stdout, 'binary', function(error) {
                        if (error) {
                            cb(error, undefined);
                        }
                        else {
                            cb(undefined, new Image({path:fullFilePath}), filePath); 
                        }
                    });
                });
            }
        });
    }
    // extend = pode cortar a imagem
    else {
        imagemagick.identify(originalFullFilePath, function(err, features){
            if (err) console.log(err);

            var original_width = features.width;
            var original_height = features.height;
            var original_aspect = original_width/original_height;

            var aspect = width/height;

            var resizeImageProperties = {};
            resizeImageProperties.srcData = originalImage;

            if (original_aspect >= aspect) {
                resizeImageProperties.width = width;
                imagemagick.resize(resizeImageProperties, function(error, stdout, stderr){
                    if (error) cb(error, undefined, undefined);
                    else {
                        new File(fullFolderPath).createDirectory(function() {
                            fs.writeFileSync(fullFilePath, stdout, 'binary');
                            var cropImageProperties = {};
                            cropImageProperties.srcPath = fullFilePath;
                            cropImageProperties.dstPath = fullFilePath;
                            if (width) cropImageProperties.width = width;
                            if (height) cropImageProperties.height = height;

                            imagemagick.crop(cropImageProperties, function(err, stdout, stderr){
                                if (error) {
                                    cb(error, undefined, undefined);
                                }
                                else {
                                    cb(undefined, new Image({path:fullFilePath}), filePath);
                                }
                            }); 
                        });
                    }
                });
            }
            else {
                resizeImageProperties.height = height;
                imagemagick.resize(resizeImageProperties, function(error, stdout, stderr){
                    if (error) cb(error, undefined, undefined);
                    else {
                        new File(fullFolderPath).createDirectory(function() {
                            fs.writeFileSync(fullFilePath, stdout, 'binary');
                            var cropImageProperties = {};
                            cropImageProperties.srcPath = fullFilePath;
                            cropImageProperties.dstPath = fullFilePath;
                            if (width) cropImageProperties.width = width;
                            if (height) cropImageProperties.height = height;
                            imagemagick.crop(cropImageProperties, function(error, stdout, stderr){
                                if (error) {
                                    cb(error, undefined, undefined);
                                }
                                else {
                                    cb(undefined, new Image({path:fullFilePath}), filePath);
                                }
                            }); 
                        });
                    }
                }); 
            }
        });
    }
};


/*  Exportando o pacote  */
Image = exports.Image = mongoose.model('Images', imageSchema);
