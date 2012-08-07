/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de profile
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    profileSchema,
    Profile;

profileSchema = new schema({
    username    : {type : String},
    jobs        : [require('./Job.js').Job],
    slugs       : [String],
    name        : {type : String, trim : true},
    surname     : {type : String, trim : true},
    thumbnail   : [require('./Thumbnail.js').Thumbnail],
    about       : {type : String},
    phones      : [require('./Phone.js').Phone],
    contacts    : [require('./Contact.js').Contact],
    links       : [require('./Link.js').Link],
    dateCreated : {type : Date},
    dateUpdated : {type : Date}
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
profileSchema.pre('save', function (next) {
    "use strict";

    Profile.findOne({username : this.username, _id : {$ne : this._id}}, function (error, user) {
        if (error) {
            next(error);
        } else {
            if (user === null) {
                next();
            } else {
                next(new Error('username already exists'));
            }
        }
    });
});

/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profiles', profileSchema);