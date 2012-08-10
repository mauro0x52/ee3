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
    username    : {type : String, required : true, trim : true, unique : true},
    jobs        : [require('./Job.js').Job],
    slugs       : [String],
    name        : {type : String, required : true, trim : true},
    surname     : {type : String, trim : true},
    thumbnail   : [require('./Thumbnail.js').Thumbnail],
    about       : {type : String},
    phones      : [require('./Phone.js').Phone],
    contacts    : [require('./Contact.js').Contact],
    links       : [require('./Link.js').Link],
    dateCreated : {type : Date},
    dateUpdated : {type : Date}
});

/** IsOwner
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Verifica se o usuário é dono da empresa
 * @param id : username do usuário
 *
 * @return : Boolean
 */
profileSchema.methods.isOwner = function (id) {
    "use strict";

    var i,
        isOwner = false;

    //verifica se o usário é igual o solicitado
    if (this.username === id) {
        isOwner = true;
    }
    
    return isOwner;
};

/** FindPhone
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um phone no profile.
 * @param id : id do phone
 * @param cb : callback a ser chamado após achado o phone
 */
profileSchema.methods.findPhone = function (id, cb) {
    "use strict";

    var i,
        phone;

    //varre os phones do profile
    for (i = 0; i < this.phones.length; i = i + 1) {
        if (this.phones[i]._id.toString() === id.toString()) {
            phone = this.phones[i];
        }
    }
    if (phone) {
        cb(undefined, phone);
    } else { 
        cb('phone not found', null);
    }
};

/** FindLink
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um link no profile.
 * @param id : id do link
 * @param cb : callback a ser chamado após achado o link
 */
profileSchema.methods.findLink = function (id, cb) {
    "use strict";

    var i,
        link;

    //varre os phones do profile
    for (i = 0; i < this.links.length; i = i + 1) {
        if (this.links[i]._id.toString() === id.toString()) {
            link = this.links[i];
        }
    }
    if (link) {
        cb(undefined, link);
    } else { 
        cb('phone not found', null);
    }
};

/** FindJob
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um link no profile.
 * @param id : id do link
 * @param cb : callback a ser chamado após achado o link
 */
profileSchema.methods.findJob = function (id, cb) {
    "use strict";

    var i,
        job;

    //varre os phones do profile
    for (i = 0; i < this.jobs.length; i = i + 1) {
        if (this.jobs[i]._id.toString() === id.toString()) {
            job = this.jobs[i];
        }
    }
    if (job) {
        cb(undefined, job);
    } else { 
        cb('phone not found', null);
    }
};

/** FindContact
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um contact no profile.
 * @param id : id do contact
 * @param cb : callback a ser chamado após achado o contact
 */
profileSchema.methods.findContact = function (id, cb) {
    "use strict";

    var i,
        contact;
        
    //varre os phones do profile
    for (i = 0; i < this.contacts.length; i = i + 1) {
        if (this.contacts[i]._id.toString() === id.toString()) {
            contact = this.contacts[i];
        }
    }
    if (contact) {
        cb(undefined, contact);
    } else { 
        cb('phone not found', null);
    }
};

/** FindThumbnail
 * @author : Rafael Erthal e Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um contact no thumbnail.
 * @param id : id do thumbnail
 * @param cb : callback a ser chamado após achado o thumbnail
 */
profileSchema.methods.findThumbnail = function (id, cb) {
    "use strict";

    var i,
        thumbnail;
        
    //varre os phones do profile
    for (i = 0; i < this.thumbnails.length; i = i + 1) {
        if (this.thumbnails[i]._id.toString() === id.toString()) {
            thumbnail = this.thumbnails[i];
        }
    }
    if (thumbnail) {
        cb(undefined, thumbnail);
    } else { 
        cb('phone not found', null);
    }
};

/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profiles', profileSchema);