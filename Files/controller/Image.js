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

    /** POST /image
     *
     * @autor : Mauro Ribeiro
     * @since : 2012-07
     *
     * @description : Salva nova imagem
     *
     * @allowedApp : Apenas o www
     * @allowedUser : Público
     *
     * @request : {path, file}
     * @response : {image}
     */
    app.post('/image', function (request,response) {
        var crypto = require('crypto'),
            path = require('path'),
            dateUtils = require('date-utils'),
            file, image, hash, folder, folderPath, fileNameSplit, fileExt, filePath;
        
        response.contentType('json');

        // caminho escolhido
        folderPath = request.param('path', null);
        
        // arquivo da imagem
        file = request.files.file;

        // extensao do arquivo
        fileNameSplit = path.extname(request.files.file.name||'').split('.');
        fileExt = fileNameSplit[fileNameSplit.length - 1];

        // nome unico para a pasta: ANO + MES + DIA + hash[10]
        hash = crypto.createHash('md5').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
        folder = Date.today().toFormat('YYYYMMDD') + hash;
        // caminho do arquivo    
        filePath = folderPath + '/' + folder + '/original.' + fileExt;

        image = new Image({
            path : filePath,
            file : file
        });

        image.save(function(error){
            if (error) console.log(error);
        });

    }); // post /image

    app.put('/image/*/resize', function (request,response) {
        var crypto = require('crypto'),
            width = request.param('width', null),
            height = request.param('height', null),
            style = request.param('style', null),
            label = request.param('label', null),
            image, filePath;
        
        response.contentType('json');

        // arquivo a ser resizeado
        filePath = '/'+request.params[0];
        
        Image.findOne({ path : filePath }, function (error, image) {
            if (error) {
                console.log(error);
            }
            else if (!image) {
                console.log(filePath + ' nao existe');
            }
            else {
                image.resize({style:style, width:width, height:height, label:label}, function(error){});
            }
        });
    }); // put /image/*/resize

    app.del('/image/*', function (request,response) {
        
    });

};
