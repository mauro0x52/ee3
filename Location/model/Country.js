/** Country
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representação da entidade de países
 */
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    countrySchema, Country;

countrySchema = new Schema({
    name      : {type : String, trim : true, required : true},
    acronym   : {type : String, required : true},
    slug      : {type : String, trim : true},
    ddi       : {type : String, required : true},
    regionIds : [{type: objectId}]
});

countrySchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        country = this;

    country.name = country.name.replace(/\s+/g, ' ');

    slug = country.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    Country.find({slug : slug, _id : {$ne : country._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                country.slug = slug;
            }
            else {
                country.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
});

/** FindByIdOrSlug
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura um pa�s pelo id ou pelo slug
 * @param id : id ou slug do pa�s
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