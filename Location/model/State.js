/** State
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de estados
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    stateSchema;

stateSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, required : true, unique : true},
    countryId : {type: objectId},
    regionIds : [{type: objectId}]
});

stateSchema.pre('save', function(next) {
    var crypto = require('crypto');

    if (this.isNew) {
        //TODO fazer o gerador de slugs aqui
        this.slug = 'slug-'+crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
    }

    next();
});
/*  Exportando o pacote  */
exports.State = mongoose.model('States', stateSchema);