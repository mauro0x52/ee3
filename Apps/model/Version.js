/** Version
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de versões de um aplicativo
 */
 
var Tool = require('./Tool.js'),
    Plugin = require('./Plugin.js'),
    Dialog = require('./Dialog.js'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    versionSchema;
    
versionSchema = new schema({
    number : {type : String, trim : true, required : true},
    appId  : objectId
});

/** Tools
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega as ferramentas de uma versão
 * @param cb : callback a ser chamado após achadas as ferramentas
 */
versionSchema.methods.tools = function (cb) {
    Tool.find({versionId : this._id}, cb);
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
    Tool.findOne({versionId : this._id, name : name}, cb);
};

/** Plugins
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os plugins de uma versão
 * @param cb : callback a ser chamado após achadas os plugins
 */
versionSchema.methods.plugins = function (cb) {
    Plugin.find({versionId : this._id}, cb);
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
    Plugin.findOne({versionId : this._id, name : name}, cb);
};

/** Dialogs
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os dialogos de uma versão
 * @param cb : callback a ser chamado após achadas os plugins
 */
versionSchema.methods.dialogs = function (cb) {
    Dialog.find({versionId : this._id}, cb);
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
    Dialog.findOne({versionId : this._id, name : name}, cb);
};

/*  Exportando o pacote  */
exports.Version = mongoose.model('Versions', versionSchema);