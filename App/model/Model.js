/** Model
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.App     = require('./App.js').App;
exports.Version = require('./Version.js').Version;
exports.Tool    = require('./Tool.js').Tool;
exports.Plugin  = require('./Plugin.js').Plugin;
exports.Dialog  = require('./Dialog.js').Dialog;