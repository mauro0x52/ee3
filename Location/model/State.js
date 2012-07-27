/** State
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de estados
 */
 
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    stateSchema, State;
    
stateSchema = new schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true},
    countryId : {type: objectId},
    regionIds : [{type: objectId}]
});

/*  Exportando o pacote  */
exports.State = mongoose.model('States', stateSchema);