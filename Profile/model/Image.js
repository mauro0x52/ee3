/** Image
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de Image
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    imageSchema;

imageSchema = new schema({
    file   : {type : objectId},
    url    : {type : String, trim: true},
    title  : {type : String, trim: true},
    legend : {type : String}
});

/*  Exportando o pacote  */
exports.Image = imageSchema;