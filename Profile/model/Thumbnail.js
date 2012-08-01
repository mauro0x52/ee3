/** Thumbnail
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de Thumbnail
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    thumbnailSchema;

thumbnailSchema = new schema({
    small  : {type : objectId},
    medium : {type : objectId},
    large  : {type : objectId}
});

/*  Exportando o pacote  */
exports.Thumbnail = mongoose.model('Thumbnail', thumbnailSchema);