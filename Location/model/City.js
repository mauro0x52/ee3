/** City
 * @author : Lucas Clado
 * @since : 2012-07
 *
 * @description : Representação da entidade de cidades
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    citySchema;

citySchema = new Schema({
    name     : {type : String, trim : true, required : true},
    slug     : {type : String, trim : true, required : true, unique : true},
    ddd      : {type : Number, required : true},
    stateId  : {type: objectId},
    regionIds : [{type: objectId}]
});

citySchema.pre('save', function(next) {
    if (this.isNew) {
        //TODO fazer o gerador de slugs aqui
        this.slug = 'slug-'+crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 10);
    }

    next();
});
/*  Exportando o pacote  */
exports.City = mongoose.model('Cities', citySchema);