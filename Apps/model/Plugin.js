/** Plugin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de plugin de uma versão de um aplicativo
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    pluginSchema,
    Plugin;

pluginSchema = new Schema({
    name      : {type : String, trim : true, required : true, unique : true},
    source    : {type : String, required : true},
    slug    : {type : String, trim : true, unique : true},
    version   : {type : objectId}
});

/*  Exportando o pacote  */
Plugin = exports.Plugin = mongoose.model('Plugins', pluginSchema);