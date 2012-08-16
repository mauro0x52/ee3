/** AuthorizedApp
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Aplicativos autorizados para o usuário
 */

var mongoose = require('mongoose'),
    Schema  = mongoose.Schema,
    objectId = Schema.ObjectId,
    authorizedAppSchema;

authorizedAppSchema = new Schema({
    appId             : {type : objectId},
    token             : {type : String, trim : true, required : true},
    expirationDate    : {type : Date},
    authorizationDate : {type : Date}
});

/*  Exportando o pacote  */
exports.AuthorizedApp = authorizedAppSchema;