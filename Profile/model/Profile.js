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
    slugs,
    Profile;

slugs = new schema({
    name : {type : String, trim : true}
});

profileSchema = new schema({
    username    : {type : String},
    jobs        : [require('./Job')],
    slugs       : [slugs],
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

/** findProfileForSlug
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Busca um profile pelo Slug enviado.
 * @param slug : o slug que vai ser feito a busca.
 * @param cb : callback a ser chamado após achado o profile
 */
profileSchema.statics.findProfileForSlug = function (slug, cb) {
    var query = Profile.findOne();
    
    query.where("slugs");
    query.in([slug]);
    
    query.exec(cb);
}

/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profile', profileSchema);