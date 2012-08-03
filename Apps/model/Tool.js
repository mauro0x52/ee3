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
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se tool ja existe
 */
toolSchema.pre('save', function (next) {
    "use strict";

    Tool.findOne({name : this.name}, function (error, tool) {
        if (error) {
            next(error);
        } else {
            if (tool === null) {
                next();
            } else {
                next('tool already exists');
            }
        }
    });
});

/*  Exportando o pacote  */
Tool = exports.Tool = mongoose.model('Tools', toolSchema);