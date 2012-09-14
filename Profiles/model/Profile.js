/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de profile
 */

var mongoose = require('mongoose'),
    crypto   = require('crypto'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    profileSchema,
    Profile;

profileSchema = new schema({
    user      : {type : objectId},
    jobs        : [require('./Job.js').Job],
    slug        : {type : String, trim : true, unique : true},
    name        : {type : String, required : true, trim : true},
    surname     : {type : String, trim : true},
    thumbnail   : require('./Thumbnail.js').ThumbnailStruct,
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
 * @description : gera slug do profile
 */
profileSchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        profile = this;

    this.name = this.name.replace(/\s+/g, ' ');

    slug = this.name + ' ' + this.surname;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    Profile.find({slug : slug, _id : {$ne : this._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                profile.slug = slug;
            }
            else {
                profile.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
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
    if (this.user.toString() === id) {
        isOwner = true;
    }

    return isOwner;
};


/** FindByIdentity
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um profile pelo id ou pelo slug
 * @param id : id ou slug do profile
 * @param cb : callback a ser chamado
 */
profileSchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        Profile.findById(id, cb);
    } else {
        // procura por slug
        Profile.findOne({slug : id}, cb);
    }
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
        cb({message :  'phone not found', name : 'NotFoundError', id : id, path : 'phone'}, null);
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
        cb({message :  'phone not found', name : 'NotFoundError', id : id, path : 'phone'}, null);
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
        cb({message :  'phone not found', name : 'NotFoundError', id : id, path : 'phone'}, null);
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
        cb({message :  'phone not found', name : 'NotFoundError', id : id, path : 'phone'}, null);
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
        cb({message :  'phone not found', name : 'NotFoundError', id : id, path : 'phone'}, null);
    }
};

/*  Exportando o pacote  */
Profile = exports.Profile = mongoose.model('Profiles', profileSchema);