/** Region
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representação da entidade de região
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    regionSchema;

regionSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true},
    countryIds : [{type: objectId}],
    cityIds    : [{type: objectId}],
    stateIds   : [{type: objectId}]
});

/*  Exportando o pacote  */
exports.Region = mongoose.model('Regions', regionSchema);