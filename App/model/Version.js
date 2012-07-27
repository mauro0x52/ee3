/** Version
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de versões de um aplicativo
 */
 
var Tool = require('./Tool.js'),
    Plugin = require('./Plugin.js'),
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
userSchema.methods.tools = function (cb) {
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
userSchema.methods.findTool = function (name, cb) {
    Tool.find({versionId : this._id, name : name}, cb);
};

/** Plugins
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os plugins de uma versão
 * @param cb : callback a ser chamado após achadas os plugins
 */
userSchema.methods.plugins = function (cb) {
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
userSchema.methods.findTool = function (name, cb) {
    Tool.find({versionId : this._id, name : name}, cb);
};

/*  Exportando o pacote  */
exports.Version = mongoose.model('Versions', versionSchema);