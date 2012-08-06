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
    small  : {type : String, trim : true, required : true},
    medium : {type : String, trim : true, required : true},
    large  : {type : String, trim : true, required : true}
});

exports.Thumbnail = thumbnailSchema;