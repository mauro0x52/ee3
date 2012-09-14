/** Link
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de links
 */

var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    linkSchema;

linkSchema = new schema({
    type : {type : String, required : true, enum : ['blog', 'youtube', 'facebook', 'vimeo', 'slideshare', 'website']},
    url  : {type : String, required : true, trim : true}
});

/*  Exportando o pacote  */
exports.Link = linkSchema;