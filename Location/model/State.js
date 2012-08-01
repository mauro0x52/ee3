/** State
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de estados
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    stateSchema;

stateSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true},
    countryId : {type: objectId},
    regionIds : [{type: objectId}]
});

/*  Exportando o pacote  */
exports.State = mongoose.model('States', stateSchema);