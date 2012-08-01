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
    url    : {type : string, trim: true},
    title  : {type : string, trim: true},
    legend : {type : string}
});

/*  Exportando o pacote  */
exports.Image = mongoose.model('Image', imagSchema);