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
    small  : [require('./Image.js').Image],
    medium : [require('./Image.js').Image],
    large  : [require('./Image.js').Image]
});

/*  Exportando o pacote  */
exports.Thumbnail = thumbnailSchema;