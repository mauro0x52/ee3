/** File
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Representação da entidade de arquivos
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    fileSchema;

fileSchema = new Schema({
    path        : {type : String, trim : true, required : true},
    fullPath    : {type : String, trim : true},
    url         : {type : String, trim : true}
});

fileSchema.pre('save', function (next) {
    "use strict";

    var url, fullPath;

    if (config.aws.s3.enabled) {
        url = config.aws.s3.bucket + '.s3.amazonaws.com/' + this.path;
        fullPath = '/' + config.aws.s3.bucket + '/' + this.path;
    } else {
        url = config.host.url + ':' + config.host.port + '/uploads/' + this.path;
        fullPath = config.files.folder + '/' + this.path;
    }

    // tira barras duplicadas
    while (url.indexOf('//') !== -1) {
        url = url.replace('//', '/');
    }
    url = 'http://' + url;
    this.url = url;

    // tira barras duplicadas
    while (fullPath.indexOf('//') !== -1) {
        fullPath = fullPath.replace('//', '/');
    }
    this.fullPath = fullPath;

    next();
});

fileSchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        this.findById(id, cb);
    } else if (id.indexOf('http://') >= 0) {
        // procura por url
        this.findOne({url : id}, cb);
    } else {
        // procura por path
        this.findOne({path : id}, cb);
    }
}

/*  Exportando o pacote  */
exports.File = mongoose.model('Files', fileSchema);
