/** ThirdPartyLogin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Logins externos do usuário
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    thirdPartyLoginSchema;

thirdPartyLoginSchema = new Schema({
    server : {type : String, trim : true, required : true, lowercase : true},
    token  : {type : String, trim : true, required : true},
    id     : {type : String, trim : true}
});

/*  Exportando o pacote  */
exports.ThirdPartyLogin = thirdPartyLoginSchema;