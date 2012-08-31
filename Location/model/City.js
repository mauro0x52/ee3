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
    name    : {type : String, trim : true, required : true},
    slug    : {type : String, trim : true},
    state   : {type: objectId}
//  ddd     : {type : Number, required : true},
//  regions : [{type: objectId}]
});


/** FindByIdOrSlug
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura uma cidade pelo id ou pelo slug
 * @param id : id ou username do produto
 * @param state : ID do state
 * @param cb : callback a ser chamado
 */
citySchema.statics.findByIdentity = function (id, stateId, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        City.findOne({_id : id}, cb);
    } else {
        // procura por slug
        City.findOne({state : stateId, slug : id}, cb);
    }
};

/*  Exportando o pacote  */
City = exports.City = mongoose.model('Cities', citySchema);