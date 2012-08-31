/** Region
 * @author : Lucas Calado
 * @since : 2012-07
 *
 * @description : Representação da entidade de região
 */

var crypto = require('crypto'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    regionSchema,
    Region;

regionSchema = new Schema({
    name      : {type : String, trim : true, required : true},
    slug      : {type : String, trim : true, unique : true},
    symbol    : {type : String, required : true},
    countries : [{type: objectId}],
    cities    : [{type: objectId}],
    states    : [{type: objectId}]
});

regionSchema.pre('save', function(next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        region = this;

    region.name = region.name.replace(/\s+/g, ' ');

    slug = region.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    Region.find({slug : slug, _id : {$ne : region._id}}, function (error, data) {
        if (error) next(error);
        else {
            if (data.length === 0) {
                region.slug = slug;
            }
            else {
                region.slug = slug + '-' + data.length + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);
            }
            next();
        }

    });
});

/** FindByIdOrSlug
 * @author : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Procura uma regi�o pelo id ou pelo slug
 * @param id : id ou slug da regi�o
 * @param cb : callback a ser chamado
 */
regionSchema.statics.findByIdentity = function (id, cb) {
    "use strict";

    if (new RegExp("[0-9 a-f]{24}").test(id)) {
        // procura por id
        Region.findById(id, cb);
    } else {
        // procura por slug
        Region.findOne({slug : id}, cb);
    }
};

/*  Exportando o pacote  */
Region = exports.Region = mongoose.model('Regions', regionSchema);