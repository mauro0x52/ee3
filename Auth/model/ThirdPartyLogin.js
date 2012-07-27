/** ThirdPartyLogin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Logins externos do usuário
 */
 
 var mongoose = require('mongoose'),
     schema   = mongoose.Schema,
     objectId = schema.ObjectId,
     thirdPartyLoginSchema;
 
thirdPartyLoginSchema = new schema({
    server : {type : String, trim : true, required : true, lowercase : true},
    token  : {type : String, trim : true, required : true},
    id     : {type : String, trim : true}
});

/*  Exportando o pacote  */
exports.ThirdPartyLogin = thirdPartyLoginSchema; 