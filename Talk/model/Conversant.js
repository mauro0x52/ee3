/** Conversant
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de participante de chat
 */

var Thread = require('./Thread.js').Thread,
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    conversantSchema,
    Conversant;

conversantSchema = new Schema({
    user      : {type : String, trim : true, required : true},
    label     : {type : String, trim : true, required : true},
    lastCheck : {type : Date, required : true},
    threadIds : [objectId]
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
conversantSchema.pre('save', function (next) {
    "use strict";

    Conversant.findOne({user : this.user, _id : {$ne : this._id}}, function (error, user) {
        if (error) {
            next(error);
        } else {
            if (user === null) {
                next();
            } else {
                next('username already exists');
            }
        }
    });
});

/** Threads
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : busca as threads de um usuário
 * @param cb : callback a ser chamado para cada thread
 */
conversantSchema.methods.threads = function (cb) {
    "use strict";

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
    "use strict";

    var now = new Date();

    cb(now.getTime() - this.lastCheck.getTime() < 20000);
};

/*  Exportando o pacote  */
Conversant = exports.Conversant = mongoose.model('Conversants', conversantSchema);