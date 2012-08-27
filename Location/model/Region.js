/** Region
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representação da entidade de região
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    regionSchema;

regionSchema = new Schema({
    name       : {type : String, trim : true, required : true},
    slug       : {type : String, trim : true, unique : true},
    countryIds : [{type: objectId}],
    cityIds    : [{type: objectId}],
    stateIds   : [{type: objectId}]
});

regionSchema.pre('save', function(next) {
    var crypto = require('crypto');

    if (this.isNew) {
        //TODO fazer o gerador de slugs aqui
        this.slug = 'slug-'+crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
    }

    next();
});

/*  Exportando o pacote  */
exports.Region = mongoose.model('Regions', regionSchema);