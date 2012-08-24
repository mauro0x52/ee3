/** Product
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de produto
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    productSchema,
    Product;

productSchema = new Schema({
    name       : {type : String, trim : true, required : true},
    slug       : {type : String, trim : true},
    thumbnail  : require('./Thumbnail.js').ThumbnailStruct,
    abstract   : {type : String},
    about      : {type : String},
    links      : [require('./Link.js').Link],
    images     : [require('./Image.js').Image],
});


/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o slug ja existe
 */
productSchema.pre('save', function (next) {
    var crypto = require('crypto'),
        slug, foundSlug,
        charFrom = 'àáâãäåçèéêëìíîïñðóòôõöøùúûüýÿ',
        charTo   = 'aaaaaaceeeeiiiinooooooouuuuyy',
        i;

    this.name = this.name.replace(/\s+/g, ' ');

    slug = this.name;
    slug = slug.replace(/^\s+|\s+$/g, '').replace(/\s+/g, '-').toLowerCase();
    // remove acentos
    for (var i = 0; i < charFrom.length; i++) {
        slug = slug.replace(new RegExp(charFrom.charAt(i), 'g'), charTo.charAt(i))
    }
    this.slug = slug.replace(/[^a-z,0-9,\-]/g, '');

    foundSlug = false;

    for (i = 0; i < this.parent.products.length; i = i + 1) {
        if (this.parent.products[i]._id !== this._id && this.parent.products[i].slug === this.slug) {
            foundSlug = true;
        }
    }
    if (foundSlug) this.slug = this.slug + '-' + this.parent.products.length; + '' + crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 1);

    next();
});


/** FindImage
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura uma imagem de um produto.
 * @param id : id da imagem
 * @param cb : callback a ser chamado após achada a imagem
 */
productSchema.methods.findImage = function (id, cb) {
    "use strict";

    var i,
        image;

    //varre os links do produto
    for (i = 0; i < this.images.length; i = i + 1) {
        if (this.images[i]._id.toString() === id.toString()) {
            image = this.images[i];
        }
    }
    if (image) {
        cb(undefined, image);
    } else {
        cb('image not found', null);
    }
};

/** FindLink
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um link de um produto.
 * @param id : id do link
 * @param cb : callback a ser chamado após achado o link
 */
productSchema.methods.findLink = function (id, cb) {
    "use strict";

    var i,
        link;

    //varre os links do produto
    for (i = 0; i < this.links.length; i = i + 1) {
        if (this.links[i]._id.toString() === id.toString()) {
            link = this.links[i];
        }
    }
    if (link) {
        cb(undefined, link);
    } else {
        cb('link not found', null);
    }
};

/** findThumbnail
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Procura um thumbnail de um produto.
 * @param id : id do thumbnail
 * @param cb : callback a ser chamado após achado o thumbnail
 */
productSchema.methods.findThumbnail = function (id, cb) {
    "use strict";

    var i,
        thumbnail;

    //varre os links do produto
    for (i = 0; i < this.thumbnails.length; i = i + 1) {
        if (this.thumbnails[i]._id.toString() === id.toString()) {
            thumbnail = this.thumbnails[i];
        }
    }
    if (thumbnail) {
        cb(undefined, thumbnail);
    } else {
        cb('thumbnail not found', null);
    }
};

Product = exports.Product = productSchema;