/** Thread
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade thread
 */

var mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    threadSchema,
    messageSchema;

messageSchema = new Schema({
    content   : {type : String, required : true},
    date      : {type : Date, required : true},
    readBy    : [objectId],
    sender    : {type : objectId}
});

threadSchema = new Schema({
    place     : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true},
    name      : {type : String, trim : true, required : true},
    status    : {type : String, required : true, enum : ['active', 'inactive']},
    messages  : [messageSchema]
});

threadSchema.pre('save', function(next) {
    if (this.isNew) {
        //TODO fazer o gerador de slugs aqui
        this.slug = 'slug-'+crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
    }

    next();
});

/** Deactivate
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : desativa uma thread
 * @param cb : callback a ser chamado após mudificado o estado da thread
 */
threadSchema.methods.deactivate = function (cb) {
    "use strict";

    this.label = 'inactive';
    this.save(cb);
};

/** UnreadMessages
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Retorna as mensagens não lidas em uma thread por um usuário
 * @param cb : callback a ser chamado após localizadas as mensagens
 * @param user : usuário que procura as mensagens
 */
threadSchema.methods.unreadMessages = function (user, cb) {
    "use strict";

    var i,
        j,
        unread,
        res = [];

    //percorre todas as mensagens da thread
    for (i = 0; i < this.messages.length; i = i + 1) {
        //verifica se a mensagem já foi lida pelo usuário
        unread = true;
        for (j = 0; j < this.messages[i].readBy.length; j = j + 1) {
            if (this.messages[i].readBy[j].toString() === user._id.toString()) {
                unread = false;
            }
        }
        if (unread) {
            //coloca as mensagens não lidas em um array
            res.push(this.messages[i]);
            //marca a mensagem como lida pelo usuário
            this.messages[i].readBy.push(user._id);
            this.save();
        }
    }
    //retorna as mensagens
    cb(res);
};

/*  Exportando o pacote  */
exports.Thread = mongoose.model('Threads', threadSchema);