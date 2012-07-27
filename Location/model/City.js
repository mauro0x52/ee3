/** City
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de cidades
 */
 
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    citySchema, City;

citySchema = new schema({
    name     : {type : String, trim : true, required : true},
    slug     : {type : String, trim : true, required : true},
    ddd      : {type : Number, required : true},
    stateId  : {type: objectId},
    regionIds : [{type: objectId}]
});


/*  Exportando o pacote  */
exports.City = mongoose.model('Cities', citySchema);