/** Dialog
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de dialogo de uma versão de um aplicativo
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    dialogSchema;
    
dialogSchema = new schema({
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/*  Exportando o pacote  */
exports.Dialog = mongoose.model('Dialogs', dialogSchema);