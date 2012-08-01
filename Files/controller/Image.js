/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de imagens
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        Image  = Model.Image;

    var config  = require('../config.js');

    app.get('/teste', function (request,response) {
        var image = new Image({
            path : 'testeeeeeeeeeeeeee',
            url  : 'testeeeeeeeeeeeeeeeeee'
        });
        image.save(function(error) {
            if (error) console.log(error);
        });
    });

    app.post('/image', function (request,response) {

        var fs = require('fs');
        var crypto = require('crypto');
        var fileUtils = require('file-utils');
        var dateUtils = require('date-utils');
        var path = require('path');
        var File = fileUtils.File;

        var folderPath = request.param('path', '/');

        var hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex').substring(0, 10);

        var folder = '/' + Date.today().toFormat('YYYYMMDD') + hash + '/';

        var filenameSplit = path.extname(request.files.file.name||'').split('.');
        var fileExt = filenameSplit[filenameSplit.length - 1];

        if (request.files.file.size <= config.images.maxsize) {
            if (config.s3.enabled) {

            }
            else {
                var filePath = config.images.folder + folderPath + folder ;

                new File(filePath).createDirectory(function() {

                    fs.rename(
                        request.files.file.path, 
                        filePath + 'original.' + fileExt,
                        function(error) {
                            if (error) console.log(error);
                            else console.log(filePath + 'original.' + fileExt+' salvo');
                        }
                    );
                });
            }
        }
        else {
            console.log('tamanho excedido');
        }   
    });

    app.put('/image/*/resize', function (request,response) {


        var imagemagick = require('imagemagick'),
             fs = require('fs'),
            path = require('path');

        var fileUtils = require('file-utils');
        var File = fileUtils.File;

        var width = request.param('width', null);
        var height = request.param('height', null);
        var style = request.param('style', null);
        var label = request.param('label', null);

        var filePath = config.images.folder + request.params[0];
        var folderPath = filePath.substring(0, filePath.lastIndexOf("/"));

        var filenameSplit = path.extname(filePath||'').split('.');
        var newFilePath = folderPath + '/' + label + '.' + filenameSplit[filenameSplit.length - 1];
 

        var image = fs.readFileSync(filePath, 'binary');

        // fit = nao corta a imagem
        if (style == 'fit') {
            var imageProperties = {};
            imageProperties.srcData = image;

            if (width) imageProperties.width = width;
            if (height) imageProperties.height = height;

            imagemagick.resize(imageProperties, function(err, stdout, stderr){
                if (err) console.log(err)
                fs.writeFileSync(newFilePath, stdout, 'binary');
            });
        }
        // extend = pode cortar a imagem
        else {

            imagemagick.identify('/home/mauro/images/teste.jpg', function(err, features){
                if (err) console.log(err);

                var original_width = features.width;
                var original_height = features.height;
                var original_aspect = original_width/original_height;

                var aspect = width/height;

                var resizeImageProperties = {};
                resizeImageProperties.srcData = image;

                if (original_aspect >= aspect) {
                    resizeImageProperties.width = width;
                    imagemagick.resize(resizeImageProperties, function(err, stdout, stderr){
                        if (err) console.log(err)
                        fs.writeFileSync(newFilePath, stdout, 'binary');
                        var cropImageProperties = {};
                        cropImageProperties.srcPath = newFilePath;
                        cropImageProperties.dstPath = newFilePath;
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
                        fs.writeFileSync(newFilePath, stdout, 'binary');
                        var cropImageProperties = {};
                        cropImageProperties.srcPath = newFilePath;
                        cropImageProperties.dstPath = newFilePath;
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
    });

    app.del('/image/*', function (request,response) {
        
    });

};
