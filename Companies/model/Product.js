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
    slugs      : [{type : String, trim : true, required : true, unique : true}],
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
    "use strict";

    Product.findOne({"slugs" : {$in : this.slugs}, _id : {$ne : this._id}}, function (error, app) {
        if (error) {
            next(error);
        } else {
            if (app === null) {
                next();
            } else {
                next('slug already exists');
            }
        }
    });
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

    var i;

    //varre os links do produto
    for (i = 0; i < this.images.length; i = i + 1) {
        if (this.images[i]._id.toString() === id.toString()) {
            cb(undefined, this.images[i])
        }
    }
    cb('image not found', null);
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

    var i;

    //varre os links do produto
    for (i = 0; i < this.links.length; i = i + 1) {
        if (this.links[i]._id.toString() === id.toString()) {
            cb(undefined, this.links[i])
        }
    }
    cb('link not found', null);
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

    var i;

    //varre os links do produto
    for (i = 0; i < this.thumbnails.length; i = i + 1) {
        if (this.thumbnails[i]._id.toString() === id.toString()) {
            cb(undefined, this.thumbnails[i])
        }
    }
    cb('thumbnail not found', null);
};

Product = exports.Product = productSchema;