/** Version
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de versões de um aplicativo
 */

var Tool = require('./Tool.js').Tool,
    Plugin = require('./Plugin.js').Plugin,
    Dialog = require('./Dialog.js').Dialog,
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    versionSchema,
    Version;

versionSchema = new Schema({
    number : {type : String, trim : true, required : true},
    app    : {type : objectId}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se versao ja existe
 */
versionSchema.pre('save', function (next, done) {
    "use strict";
    
    //Verifica se já existe esta versão para o mesmo APP
    var query = Version.findOne({number : this.number, app : this.app});
    query.where("_id");
    query.ne([this._id]);
    //Localiza as versões
    query.exec(function (error, version) {
        if (error) {
            next(error);
        } else {
            //Verifica se existe uma versão igual
            if (version === null) {
                next();
            } else {
                var err = new Error('version already exists');
                next(err);
            }
        }
    });
});

/** Tools
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega as ferramentas de uma versão
 * @param cb : callback a ser chamado após achadas as ferramentas
 */
versionSchema.methods.tools = function (cb) {
    "use strict";

    Tool.find({version : this._id}, cb);
};

/** FindTool
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Busca uma ferramenta pelo nome
 * @param name : nome da ferramenta
 * @param cb : callback a ser chamado após achada a ferramenta
 */
versionSchema.methods.findTool = function (name, cb) {
    "use strict";

    Tool.findOne({version : this._id, _id : name}, cb);
};

/** Plugins
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os plugins de uma versão
 * @param cb : callback a ser chamado após achadas os plugins
 */
versionSchema.methods.plugins = function (cb) {
    "use strict";

    Plugin.find({version : this._id}, cb);
};

/** FindPlugin
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Busca um plugin pelo nome
 * @param name : nome do plugin
 * @param cb : callback a ser chamado após achado o plugin
 */
versionSchema.methods.findPlugin = function (name, cb) {
    "use strict";

    console.log(name);
    Plugin.findOne({version : this._id, _id : name}, cb);
};

/** Dialogs
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os dialogos de uma versão
 * @param cb : callback a ser chamado após achadas os plugins
 */
versionSchema.methods.dialogs = function (cb) {
    "use strict";

    Dialog.find({version : this._id}, cb);
};

/** FindDialog
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Busca um dialogo pelo nome
 * @param name : nome do dialogo
 * @param cb : callback a ser chamado após achado o dialogo
 */
versionSchema.methods.findDialog = function (name, cb) {
    "use strict";

    Dialog.findOne({version : this._id, _id : name}, cb);
};

/*  Exportando o pacote  */
Version = exports.Version = mongoose.model('Versions', versionSchema);