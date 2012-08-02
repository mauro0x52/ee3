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
    slugs       : [require('./Slug.js').Slug],
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

/** editProfile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Edita um profile.
 * @param request : os dados enviados via PUT.
 * @param parsSlugs : slugs tratados no Controller e enviado para serem salvos.
 * @param cb : callback a ser chamado após achado o profile
 */
profileSchema.methods.editProfile = function (request, parsSlugs, cb) {
    if (request.param('name', null)) {
        this.name = request.param('name', null);
    }
    
    if (request.param('surname', null)) {
        this.surname = request.param('surname', null);
    }
    
    if (request.param('about', null)) {
        this.about = request.param('about', null);
    }
    
    this.dateUpdated = new Date();
    this.save(cb);
};





/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profiles', profileSchema);