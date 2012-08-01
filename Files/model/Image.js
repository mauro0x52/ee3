/** User
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Representação da entidade de imagens
 */
 
var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    imageSchema;

imageSchema = new schema({
    path        : {type : String, trim : true, required : true}
});


/** Save
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Salva imagem antes de salvar informacoes no db
 */
imageSchema.pre('save', function (next) {

    var fs = require('fs'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
        file = this.toJSON().file,
        path = this.path,
        fullPath = config.images.folder + '/' + path,
        folderPath;


    while (path.indexOf('//') != -1) {
 		path = path.replace('//', '/');
	}

    this.path = path;

    while (fullPath.indexOf('//') != -1) {
 		fullPath = fullPath.replace('//', '/');
	}


    if (file.size > config.images.maxsize) {
        next('error');
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
                    next(error);
                }
            );
        });
    }
});


/** Resize
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Salva imagem antes de salvar informacoes no db
 */
imageSchema.methods.resize = function (params, cb) {
    var imagemagick = require('imagemagick'),
        fs = require('fs'),
        path = require('path'),
        style  = params.style ? params.style : 'extend',
        width  = params.width ? params.width : undefined,
        height = params.height ? params.height : undefined,
        label = params.label ? params.label : null,
        filePath, folderPath, fullFilePath, fullFolderPath, image,
        originalImage, originalFullFilePath, fileNameSplit, fileExt;

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

    // caminho do arquivo antigo
    originalFullFilePath = config.images.folder + this.path; 

    // extensao do arquivo
    fileNameSplit = path.extname(this.path||'').split('.');
    fileExt = fileNameSplit[fileNameSplit.length - 1];

    // caminho do novo arquivo
    filePath = this.path.substring(0, this.path.lastIndexOf("/")) + '/' + label + '.' + fileExt;
    fullFilePath = config.images.folder + filePath;

    while (filePath.indexOf('//') != -1) {
 		filePath = filePath.replace('//', '/');
	}

    while (fullFilePath.indexOf('//') != -1) {
 		fullFilePath = fullFilePath.replace('//', '/');
	}

    // pasta do novo arquivo
    folderPath = filePath.substring(0, filePath.lastIndexOf("/"));
    fullFolderPath = config.images.folder + folderPath;

    originalImage = fs.readFileSync(originalFullFilePath, 'binary');

    // fit = nao corta a imagem
    if (style == 'fit') {
        var imageProperties = {};
        imageProperties.srcData = originalImage;

        if (width) imageProperties.width = width;
        if (height) imageProperties.height = height;

        imagemagick.resize(imageProperties, function(err, stdout, stderr){
            if (err) console.log(err)
            else {
                fs.writeFileSync(fullFilePath, stdout, 'binary');
                image = new Image({
                    path = filePath;
                });
                image.save();
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
                imagemagick.resize(resizeImageProperties, function(err, stdout, stderr){
                    if (err) console.log(err)
                    fs.writeFileSync(fullFilePath, stdout, 'binary');
                    var cropImageProperties = {};
                    cropImageProperties.srcPath = fullFilePath;
                    cropImageProperties.dstPath = fullFilePath;
                    if (width) cropImageProperties.width = width;
                    if (height) cropImageProperties.height = height;

                    imagemagick.crop(cropImageProperties, function(err, stdout, stderr){
                        if (err) console.log(err);
                        else console.log("Imagem salva!");
                    }); 
                });
            }
            else {
                resizeImageProperties.height = height;
                imagemagick.resize(resizeImageProperties, function(err, stdout, stderr){
                    if (err) console.log(err)
                    fs.writeFileSync(fullFilePath, stdout, 'binary');
                    var cropImageProperties = {};
                    cropImageProperties.srcPath = fullFilePath;
                    cropImageProperties.dstPath = fullFilePath;
                    if (width) cropImageProperties.width = width;
                    if (height) cropImageProperties.height = height;

                    imagemagick.crop(cropImageProperties, function(err, stdout, stderr){
                        if (err) console.log(err);
                        else console.log("Imagem salva!");
                    }); 
                }); 
            }
        });
    }


};





/*  Exportando o pacote  */
exports.Image = mongoose.model('Images', imageSchema);
