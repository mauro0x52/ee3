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
    version   : {type : objectId}
});


/** Minify
 * @author : Mauro Ribeiro
 * @since : 2012-09
 *
 * @description : Minifica o código da ferramenta
 */
toolSchema.methods.minify = function (cb) {
    "use strict";

    var fs = require('fs'),
        jsp = require('uglify-js').parser,
        pro = require('uglify-js').uglify,
        File = require('file-utils').File,
        folderPath, appSlug, appVersion, toolSlug, names, files,
        fileData, source;

    appSlug = 'empresas';
    appVersion = '0.1';
    toolSlug = 'lista-de-empresas';

    names = [];
    files = [];
    folderPath = config.files.folder + '/' + appSlug + '/' + appVersion + '/tools/' + toolSlug + '/';

    new File(folderPath).list(function (name, path) {
        names.push(name);
        files.push(path);
        return true;
    }, function () {
        source = 'var app = function () { \n';
        for (var i in names) {
            source += names[i] + ' = function () {\n';
            source += fs.readFileSync(files[i], 'utf-8');
            source += '}\n'
        }
        source += '}';

        source = jsp.parse(source); // parse code and get the initial AST
        //source = pro.ast_mangle(source); // get a new AST with mangled names
        //source = pro.ast_squeeze(source); // get an AST with compression optimizations
        source = pro.gen_code(source); // compressed code here

        this.source = source;

        this.save(function (error) {
            cb(error, this);
        });
    });

};


/*  Exportando o pacote  */
Tool = exports.Tool = mongoose.model('Tools', toolSchema);