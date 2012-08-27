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
    citySchema, City;

citySchema = new Schema({
    name     : {type : String, trim : true, required : true},
    slug     : {type : String, trim : true, unique : true},
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

/** FindByIdOrUsername
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um usuário pelo id ou pelo username
 * @param id : id ou username do produto
 * @param cb : callback a ser chamado
 */
citySchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        City.findById(id, cb);
    } else {
        // procura por username
        City.findOne({slug : slug}, cb);
    }
};

/*  Exportando o pacote  */
City = exports.City = mongoose.model('Cities', citySchema);