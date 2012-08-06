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
    name : {type : String, trim : true, required : true},
    slug : {type : String, trim : true, required : true},
    creator : {type : String, trim : true, required : true},
    type : {type : String, required : true, enum : ['free', 'payed', 'compulsory']}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o slug ja existe
 */
appSchema.pre('save', function (next) {
    "use strict";

    App.findOne({slug : this.slug, _id : {$ne : this._id}}, function (error, app) {
        if (error) {
            next(error);
        } else {
            if (app === null) {
                next();
            } else {
                next('slug already exists');
            }
        }
    });
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