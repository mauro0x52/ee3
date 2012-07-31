/** Profile
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de profile
 */
 
var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    profileSchema;

profileSchema = new schema({
    users       : {type : objectId},
    jobs        : [require('./Job')],
    slugs       : [{type : String, trim : true}],
    name        : {type : String, trim : true},
    surname     : {type : String, trim : true},
    thumbnail   : [require('./Thumbnail')],
    about       : {type : String},
    phones      : [require('./Phone')],
    contacts    : [require('./Contact')],
    links       : [require('./Link')],
    dateCreated : {type : Date},
    dateUpdated : {type : Date}
});

/*  Exportando o pacote  */
exports.User = mongoose.model('Users', userSchema);