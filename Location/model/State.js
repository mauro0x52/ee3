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
    stateSchema, State;

stateSchema = new Schema({
    name    : {type : String, trim : true, required : true},
    slug    : {type : String, trim : true},
    country : {type: objectId},
//    regions : [{type: objectId}]
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
    var filterState = {};

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        filterState._id = id;
        filterState.country = countryId;
    } else {
        // procura por slug
        filterState.slug = id;
        filterState.country = countryId;
    }

    State.findOne(filterState, cb);
};

/*  Exportando o pacote  */
State = exports.State = mongoose.model('States', stateSchema);