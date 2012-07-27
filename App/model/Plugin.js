/** Plugin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de plugin de uma versão de um aplicativo
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    pluginSchema;
    
pluginSchema = new schema({
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/*  Exportando o pacote  */
exports.Plugin = mongoose.model('Plugins', pluginSchema);