/** App
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de Aplicativo
 */

var Version = require('./Version.js').Version,
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    appSchema,
    App;

appSchema = new Schema({
    name    : {type : String, trim : true, required : true},
    slug    : {type : String, trim : true, required : true, unique : true},
    creator : {type : String, trim : true, required : true},
    type    : {type : String, required : true, enum : ['free', 'payed', 'compulsory']}
});

/** Versions
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega as versões de um aplicativo
 * @param cb : callback a ser chamado após achadas as versões
 */
appSchema.methods.versions = function (cb) {
    "use strict";

    Version.find({appId : this._id}, cb);
};

/** FindVersion
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Busca uma versão de um aplicativo pelo número
 * @param number : número da versão a ser buscada
 * @param cb : callback a ser chamado após achada a versão
 */
appSchema.methods.findVersion = function (number, cb) {
    "use strict";

    Version.findOne({appId : this._id, number : number}, cb);
};

/*  Exportando o pacote  */
App = exports.App = mongoose.model('Apps', appSchema);