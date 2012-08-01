/** Product
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de produto
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    productSchema;

productSchema = new Schema({
    name       : {type : String, trim : true, required : true},
    slugs      : [String],
    thumbnails : [require('./Thumbnail.js').Thumbnail],
    abstract   : {type : String},
    about      : {type : String},
    links      : [require('./Link.js').Link],
    images     : [require('./Image.js').Image],
});

exports.Produtct = productSchema;