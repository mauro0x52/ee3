/** Tool
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de ferramenta de uma versão de um aplicativo
 */

var config = require('../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    toolSchema,
    Tool;

toolSchema = new Schema({
    name      : {type : String, trim : true, required : true, unique : true},
    source    : {type : String, required : true},
    slug      : {type : String, trim : true, unique : true},
    version   : {type : objectId}
});


/** Minify
 * @author : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : Minifica o código da ferramenta
 */
toolSchema.methods.minify = function (app, version, cb) {
    "use strict";

    var fs = require('fs'),
        jsp = require('uglify-js').parser,
        pro = require('uglify-js').uglify,
        File = require('file-utils').File,
        folderPath, appSlug, appVersion, toolSlug, names, files,
        fileData, source,
        tool = this;

    appSlug = app.slug;
    appVersion = version.number;
    toolSlug = this.slug;

    names = [];
    files = [];
    folderPath = config.files.folder + '/' + appSlug + '/' + appVersion + '/tools/' + toolSlug + '/';

    new File(folderPath).list(function (name, path) {
        names.push(name);
        files.push(path);
        return true;
    }, function () {
        source = 'app = { ';
        for (var i = 0; i < names.length; i++) {
            source += names[i].substring(0, names[i].length - 3) + ' : function () {';
//            if (names[i] === 'Load.js' && config.host.debuglevel > 0) {
//                source += 'debugger;'
//            }
            source += fs.readFileSync(files[i], 'utf-8');
            source += '}'
            if (i !== names.length - 1) {
                source += ',';
            }
        }
        source += '}';

        try {
            source = jsp.parse(source); // parse code and get the initial AST
            source = pro.gen_code(source); // compressed code here

            tool.source = source;

            tool.save(function (error) {
                cb(error, this);
            });
        }
        catch (error) {
            cb(error);
        }
    });

};


/*  Exportando o pacote  */
Tool = exports.Tool = mongoose.model('Tools', toolSchema);