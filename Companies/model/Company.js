/** Company
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de empresa
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    companySchema;

companySchema = new Schema({
    slug        : {type : String, lowercase : true , trim : true, required : true, unique : true},
    name        : {type : String, trim : true, required : true},
    thumbnails  : [require('./Thumbnail.js')],
    members     : [objectId],
    users       : [String],
    sectors     : [objectId],
    products    : [require('./Product.js').Product],
    addresses   : [require('./Address.js').Address],
    type        : {type : String, enum : ['freelancer', 'company', 'group'], required : true},
    profile     : {type : String, enum : ['buyer', 'seller', 'both'], required : true},
    active      : {type : Boolean, required : true},
    tags        : [{type : String, lowercase : true , trim : true}],
    activity    : {type : String, required: true},
    abstract    : {type : String},
    about       : {type : String},
    phones      : [require('./Phone.js').Phone],
    contacts    : [require('./Contact.js').Contact],
    links       : [require('./Link.js').Link],
    embeddeds   : [require('./Embedded.js').Embedded]
});

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
    var i,
        isOwner = false;

    //varre os usuário da empresa
    for (i = 0; i < this.users.length; i = i + 1) {
        if (this.users[i] === id) {
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
companySchema.methods.findProduct = function (slug, cb) {
    var i,
        j;
    
    //varre os produtos da empresa
    for (i = 0; i < this.products.length; i = i + 1) {
        //varre as slugs do produto
        for (j = 0; j < this.products[i].slugs.length; j = j + 1) {
            if (this.products[i].slugs[j] === slug) {
                cb(undefined, this.products[i]);
            }
        }
    }
    cb('product not found', null);
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
    var i;
    
    //varre os endereços da empresa
    for (i = 0; i < this.addresses.length; i = i + 1) {
        if (this.addresses[i]._id.toString() === id.toString()) {
            cb(undefined, this.addresses[i])
        }
    }
    cb('address not found', null);
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
    var i;
    
    //varre os produtos da empresa
    for (i = 0; i < this.phones.length; i = i + 1) {
        if (this.phones[i]._id.toString() === id.toString()) {
            cb(undefined, this.phones[i])
        }
    }
    cb('phone not found', null);
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
    var i;
    
    //varre os links da empresa
    for (i = 0; i < this.links.length; i = i + 1) {
        if (this.links[i]._id.toString() === id.toString()) {
            cb(undefined, this.links[i])
        }
    }
    cb('link not found', null);
};

exports.Company = mongoose.model('Companies', companySchema);