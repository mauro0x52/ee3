/** Contact
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de contact
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    contactSchema;

contactSchema = new schema({
    type    : {type : String, required : true, enum : ['Twitter', 'Msn', 'Email', 'Skype', 'Gtalk']},
    address : {type : String, required : true, trim : true}
});

/*  Exportando o pacote  */
exports.Contact = contactSchema;