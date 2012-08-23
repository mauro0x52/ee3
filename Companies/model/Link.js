/** Link
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de link
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    linkSchema, linkStruct;

linkStruct = {
    url  : {type : String, trim : true, required : true},
    type : {type : String, trim : true, required : true, enum : ['Youtube', 'Facebook', 'Vimeo', 'Slideshare', 'Blog', 'Website']}
};

linkSchema = new Schema(linkStruct);

exports.Link = linkSchema;
exports.LinkStruct = linkStruct;