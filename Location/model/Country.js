/** Country
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representação da entidade de países
     */
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    countrySchema;

countrySchema = new Schema({
    name      : {type : String, trim : true, required : true},
    acronym   : {type : String, required : true},
    slug      : {type : String, trim : true, required : true, unique : true},
    ddi       : {type : String, required : true},
    regionIds : [{type: objectId}]
});

countrySchema.pre('save', function(next) {
    var crypto = require('crypto');

    if (this.isNew) {
        //TODO fazer o gerador de slugs aqui
        this.slug = 'slug-'+crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
    }

    next();
});

/*  Exportando o pacote  */
exports.Country = mongoose.model('Countries', countrySchema);