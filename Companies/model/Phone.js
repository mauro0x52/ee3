/** Phone
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de telefone
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    phoneSchema;

phoneSchema = new Schema({
    number    : {type : String, trim : true, required : true},
    extension : {type : String, trim : true, required : true},
    areaCode  : {type : String, trim : true, required : true},
    intCode   : {type : String, trim : true, required : true},
    type      : {type : String, trim : true, required : true, enum : ['office', 'home', 'cellphone']}
});

exports.Phone = phoneSchema;