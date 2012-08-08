    /** Thumbnail
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de Thumbnail
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    thumbnailSchema;

thumbnailSchema = new Schema({
    small   : require('./Image.js').Image,
    medium  : require('./Image.js').Image,
    large   : require('./Image.js').Image
});

exports.Thumbnail = thumbnailSchema;