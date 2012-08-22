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

/** FindByIdOrUsername
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Procura um States pelo id ou pelo slug
 * @param id : id ou slug do estado
 * @param countryId : id do país que fez a solicitação
 * @param cb : callback a ser chamado
 */
stateSchema.statics.findByIdentity = function (id, countryId, cb) {
    "use strict";
    var filterState;
    
    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        filterState._id = id;
        filterState.countryId = countryId;
        City.findOne(filterState, cb);
    } else {
        // procura por username
        filterState.slug = id;
        filterState.countryId = countryId;
        City.findOne(filterState, cb);
    }
};

/*  Exportando o pacote  */
exports.State = mongoose.model('States', stateSchema);