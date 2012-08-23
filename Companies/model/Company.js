/** Company
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de empresa
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    companySchema,
    Company;

companySchema = new Schema({
    slug        : {type : String, lowercase : true , trim : true, unique : true},
    name        : {type : String, trim : true, required : true},
    thumbnail   : require('./Thumbnail.js').ThumbnailStruct,
    members     : [objectId],
    users       : [objectId],
    sectors     : [objectId],
    products    : [require('./Product.js').Product],
    addresses   : [require('./Address.js').Address],
    type        : {type : String, enum : ['freelancer', 'company', 'group'], required : true},
    active      : {type : Boolean, required : true},
    tags        : [{type : String, lowercase : true , trim : true}],
    activity    : {type : String},
    abstract    : {type : String},
    about       : {type : String},
    phones      : [require('./Phone.js').Phone],
    contacts    : [require('./Contact.js').Contact],
    links       : [require('./Link.js').Link],
    embeddeds   : [require('./Embedded.js').Embedded],
    dateCreated : {type : Date},
    dateUpdated : {type : Date}
});

companySchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        company = this;

    company.name = company.name.replace(/^\s+|\s+$/g, '');

    slug = company.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    Company.find({slug : slug, _id : {$ne : company._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                company.slug = slug;
            }
            else {
                company.slug = slug + '-' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 2);
            }
            next();
        }

    });
});


/** FindByIdOrSlug
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura uma empresa pelo id ou pelo slug
 * @param id : id ou slug do produto
 * @param cb : callback a ser chamado
 */
companySchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        Company.findById(id, cb);
    } else {
        // procura por slug
        Company.findOne({slug : id}, cb);
    }
};


/** IsOwner
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Verifica se o usuário é dono da empresa
 * @param id : username do usuário
 *
 * @return : Boolean
 */
companySchema.methods.isOwner = function (id) {
    "use strict";

    var i,
        isOwner = false;

    //varre os usuário da empresa
    for (i = 0; i < this.users.length; i = i + 1) {
        if (this.users[i].toString() === id) {
            isOwner = true;
        }
    }
    return isOwner;
};

/** FindProduct
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um produto de uma empresa.
 * @param slug : slug do produto
 * @param cb : callback a ser chamado após achado o produto
 */
companySchema.methods.findProduct = function (id, cb) {
    "use strict";

    var i,
        j,
        product;


    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        //varre os produtos da empresa
        for (i = 0; i < this.products.length; i = i + 1) {
            if (this.products[i]._id.toString() === id) {
                product = this.products[i];
            }
        }
        if (product) {
            cb(undefined, product);
        } else {
            cb('product not found', null);
        }
    } else {
        //varre os produtos da empresa
        for (i = 0; i < this.products.length; i = i + 1) {
            if (this.products[i].slug === id) {
                product = this.products[i];
            }
        }
        if (product) {
            cb(undefined, product);
        } else {
            cb('product not found', null);
        }
    }

};

/** FindContact
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um coontato de uma empresa.
 * @param id : id do contato
 * @param cb : callback a ser chamado após achado o contato
 */
companySchema.methods.findContact = function (id, cb) {
    "use strict";

    var i;

    //varre os contatos da empresa
    for (i = 0; i < this.contacts.length; i = i + 1) {
        if (this.contacts[i]._id.toString() === id.toString()) {
            cb(undefined, this.contacts[i])
        }
    }
    cb('contact not found', null);
};

/** FindEmbedded
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um embedded de uma empresa.
 * @param id : id do embedded
 * @param cb : callback a ser chamado após achado o embedded
 */
companySchema.methods.findEmbedded = function (id, cb) {
    "use strict";

    var i;

    //varre os embeddeds da empresa
    for (i = 0; i < this.embeddeds.length; i = i + 1) {
        if (this.embeddeds[i]._id.toString() === id.toString()) {
            cb(undefined, this.embeddeds[i])
        }
    }
    cb('embedded not found', null);
};

/** FindAddress
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um endereço de uma empresa.
 * @param id : id do endereço
 * @param cb : callback a ser chamado após achado o endereço
 */
companySchema.methods.findAddress = function (id, cb) {
    "use strict";

    var i,
        address;

    //varre os endereços da empresa
    for (i = 0; i < this.addresses.length; i = i + 1) {
        if (this.addresses[i]._id.toString() === id.toString()) {
            address = this.addresses[i]
        }
    }
    if (address) {
        cb(undefined, address);
    } else {
        cb('address not found', null);
    }
};

/** FindPhone
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um telefone de uma empresa.
 * @param id : id do telefone
 * @param cb : callback a ser chamado após achado o telefone
 */
companySchema.methods.findPhone = function (id, cb) {
    "use strict";

    var i,
        phone;

    //varre os produtos da empresa
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
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um link de uma empresa.
 * @param id : id do link
 * @param cb : callback a ser chamado após achado o link
 */
companySchema.methods.findLink = function (id, cb) {
    "use strict";

    var i;

    //varre os links da empresa
    for (i = 0; i < this.links.length; i = i + 1) {
        if (this.links[i]._id.toString() === id.toString()) {
            cb(undefined, this.links[i])
        }
    }
    cb('link not found', null);
};

Company = exports.Company = mongoose.model('Companies', companySchema);