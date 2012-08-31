/** Country
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representaзгo da entidade de paнses
 */
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    countrySchema, Country;

countrySchema = new Schema({
    name      : {type : String, trim : true, required : true},
    symbol   : {type : String, required : true},
    slug      : {type : String, trim : true}
//  ddi       : {type : String, required : true},
//  regions : [{type: objectId}]
});


/** FindByIdOrSlug
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um pa?s pelo id ou pelo slug
 * @param id : id ou slug do pa?s
 * @param cb : callback a ser chamado
 */
countrySchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        Country.findById(id, cb);
    } else {
        // procura por slug
        Country.findOne({slug : id}, cb);
    }
};

/*  Exportando o pacote  */
Country = exports.Country = mongoose.model('Countries', countrySchema);