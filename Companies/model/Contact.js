/** Contact
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de contato
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    contactSchema;

contactSchema = new Schema({
    address : {type : String, trim : true, required : true},
    type    : {type : String, trim : true, required : true, enum : ['Twitter', 'Msn', 'Email', 'Skype', 'GTalk']}
});

exports.Contact = contactSchema;