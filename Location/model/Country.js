/** Country
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de países
 */
 
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    countrySchema, Country;
    
countrySchema = new schema({
    name      : {type : String, trim : true, required : true},
    acronym   : {type : String, required : true},
    slug      : {type : String, trim : true, required : true},
    ddi       : {type : String, required : true},
    regionIds : [{type: objectId}]
});

/*  Exportando o pacote  */
exports.Country = mongoose.model('Countries', countrySchema);