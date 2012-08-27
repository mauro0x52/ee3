/** Phone
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de phone
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    phoneSchema;

phoneSchema = new schema({
    type      : {type : String, required : true, enum : ['office', 'home', 'cellphone']},
    number    : {type : String, required : true, trim : true},
    areaCode  : {type : String, required : true, trim : true},
    extension : {type : String, required : true,trim : true},
    intCode   : {type : String, required : true,trim : true}
});

/*  Exportando o pacote  */
exports.Phone = phoneSchema;