/** Dialog
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de dialogo de uma versão de um aplicativo
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    dialogSchema,
    Dialog;

dialogSchema = new Schema({
    name      : {type : String, trim : true, required : true, unique : true},
    source    : {type : String, required : true},
    versionId : {type : objectId}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se dialog ja existe
 */
dialogSchema.pre('save', function (next) {
    "use strict";

    Dialog.findOne({name : this.name, versionId : this.versionId, _id : {$ne : this._id}}, function (error, dialog) {
        if (error) {
            next(error);
        } else {
            if (dialog === null) {
                next();
            } else {
                next('dialog already exists');
            }
        }
    });
});

/*  Exportando o pacote  */
Dialog = exports.Dialog = mongoose.model('Dialogs', dialogSchema);