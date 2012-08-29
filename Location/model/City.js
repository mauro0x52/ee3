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
    slug    : {type : String, trim : true, unique : true},
    ddd     : {type : Number, required : true},
    state   : {type: objectId},
    regions : [{type: objectId}]
});

citySchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        city = this;

    city.name = city.name.replace(/\s+/g, ' ');

    slug = city.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    City.find({slug : slug, _id : {$ne : city._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                city.slug = slug;
            }
            else {
                city.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
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
citySchema.statics.findByIdentity = function (id, state, cb) {
    "use strict";
    var filter = {};
    
    filter.stateId = state;
    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        filter._id = id;
    } else {
        // procura por slug
        filter.slug = id;
    }
    
    City.findOne(filter, cb);
};

/*  Exportando o pacote  */
City = exports.City = mongoose.model('Cities', citySchema);