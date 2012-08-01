/** Dialog
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de dialogo de uma versão de um aplicativo
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    dialogSchema;

dialogSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/*  Exportando o pacote  */
exports.Dialog = mongoose.model('Dialogs', dialogSchema);