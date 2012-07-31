/** Conversant
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de participante de chat
 */
 
var Thread = require('./Thread.js').Thread,
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    conversantSchema;

conversantSchema = new schema({
    user      : {type : String, trim : true, required : true},
    label     : {type : String, trim : true, required : true},
    lastCheck : {type : Date, required : true},
    threadIds : [objectId]
});

/** ChangeLabel
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : busca as threads de um usuário
 * @param cb : callback a ser chamado para cada thread
 */
conversantSchema.methods.threads = function (cb) {
    Thread.find({ _id : { $in : this.threadIds } }, cb);
};

/** IsOnline
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : retorna se o usuário esta online
 * @param cb : callback a ser chamado após calculado o status
 */
conversantSchema.methods.isOnline = function (cb) {
    var now = new Date();
    cb (now.getTime() - this.lastCheck.getTime() < 20000);
};

/*  Exportando o pacote  */
exports.Conversant = mongoose.model('Conversants', conversantSchema);