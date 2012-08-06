/** Link
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de link
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    linkSchema;

linkSchema = new Schema({
    url  : {type : String, trim : true, required : true},
    type : {type : String, trim : true, required : true, enum : ['Youtube', 'Facebook', 'Vimeo', 'Slideshare', 'Blog', 'Website']}
});

exports.Link = linkSchema;