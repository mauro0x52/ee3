    /** Thumbnail
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de Thumbnail
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    thumbnailSchema;

thumbnailSchema = new Schema({
    images : [require('./Image.js').Image],
});

thumbnailSchema.virtual('original')
    .set(function (image) {this.images[0] = image})
    .get(function () {return this.images[0]});

thumbnailSchema.virtual('small')
    .set(function (image) {this.images[1] = image})
    .get(function () {return this.images[1]});

thumbnailSchema.virtual('medium')
    .set(function (image) {this.images[2] = image})
    .get(function () {return this.images[2]});

thumbnailSchema.virtual('large')
    .set(function (image) {this.images[3] = image})
    .get(function () {return this.images[3]});

exports.Thumbnail = thumbnailSchema;