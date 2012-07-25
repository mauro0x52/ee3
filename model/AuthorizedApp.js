/** AuthorizedApp
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Aplicativos autorizados para o usuário
 */
 
 var mongoose = require('mongoose'),
     schema  = mongoose.Schema,
     objectId = schema.ObjectId,
     authorizedAppSchema;
 
authorizedAppSchema = new schema({
    appId             : {type : objectId, required : true},
    token             : {type : String, trim : true, required : true},
    expirationDate    : {type : Date},
    authorizationDate : {type : Date}
});
/*  Exportando o pacote  */
exports.AuthorizedApp = authorizedAppSchema; 