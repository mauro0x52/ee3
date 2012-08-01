/** Plugin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de plugin de uma versão de um aplicativo
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    pluginSchema;

pluginSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/*  Exportando o pacote  */
exports.Plugin = mongoose.model('Plugins', pluginSchema);