/** Tool
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de ferramenta de uma versão de um aplicativo
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    toolSchema,
    Tool;

toolSchema = new Schema({
    name      : {type : String, trim : true, required : true, unique : true},
    source    : {type : String, required : true},
    versionId : {type : objectId}
});

/*  Exportando o pacote  */
Tool = exports.Tool = mongoose.model('Tools', toolSchema);