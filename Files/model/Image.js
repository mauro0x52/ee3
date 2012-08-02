/** Image
 * @author : Mauro Ribeiro
 * @since : 2012-07
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
    path        : {type : String, trim : true, required : true}
});

/** Save
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Salva imagem no filesystem
 */
imageSchema.pre('save', function (next) {
    var
    // modulos
         fs = require('fs'),
        fileUtils = require('file-utils'),
        File = fileUtils.File,
    // atributos
        file = this.toJSON().file,
        path = this.path,
    // definicoes
        fullPath = config.images.folder + '/' + path,
    // variaveis
        folderPath;


    // tira barras duplicadas
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
                    //next(error);
                }
            );
        });
    }
});


/*  Exportando o pacote  */
exports.Image = mongoose.model('Images', imageSchema);
