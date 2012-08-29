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
    regions : [{type: objectId}]
});

stateSchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        state = this;

    state.name = region.name.replace(/\s+/g, ' ');

    slug = state.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    State.find({slug : slug, _id : {$ne : state._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                state.slug = slug;
            }
            else {
                state.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
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