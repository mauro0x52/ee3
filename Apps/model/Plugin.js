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
    name      : {type : String, trim : true, required : true},
    source    : {type : String, required : true},
    versionId : objectId
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se plugin ja existe
 */
pluginSchema.pre('save', function (next) {
    "use strict";

    Plugin.findOne({name : this.name}, function (error, plugin) {
        if (error) {
            next(error);
        } else {
            if (plugin === null) {
                next();
            } else {
                next('plugin already exists');
            }
        }
    });
});

/*  Exportando o pacote  */
Plugin = exports.Plugin = mongoose.model('Plugins', pluginSchema);