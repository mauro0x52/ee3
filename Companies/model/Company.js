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

exports.Company = mongoose.model('Companies', companySchema);