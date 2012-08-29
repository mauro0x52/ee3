/** Address
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de endereço
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    addressSchema;

addressSchema = new Schema({
    street       : {type : String, trim : true, required : true},
    number       : {type : String, trim : true, required : true},
    complement   : {type : String, trim : true, required : true},
    city         : {type: objectId},
    headQuarters : {type : Boolean, required : true}
});

exports.Address = addressSchema;
