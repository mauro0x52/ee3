/** Image
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de imagem
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    imageStruct;

imageStruct = {
    file   : objectId,
    url    : {type : String, trim : true, required : true},
    title  : {type : String, trim : true},
    legend : {type : String, trim : true}
};

exports.ImageStruct = imageStruct;