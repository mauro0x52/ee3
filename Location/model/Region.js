/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de usuários
 */
 
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    regionSchema, Region;
    
regionSchema = new schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true},
    countryIds : [{type: objectId}],
    cityIds    : [{type: objectId}],
    stateIds   : [{type: objectId}]
});

/*  Exportando o pacote  */
exports.Region = mongoose.model('Regions', regionSchema);