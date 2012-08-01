/** Embedded
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Representação da entidade de embedded
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    embeddedSchema;

embeddedSchema = new Schema({
    embed     : {type : String, trim : true, required : true},
    link      : require('./Link.js').Link
});

exports.Embedded = embeddedSchema;