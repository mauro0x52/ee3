/** Sector
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de setor
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    sectorSchema;

sectorSchema = new Schema({
    name     : {type : String, trim : true, required : true},
    slug     : {type : String, lowercase : true , trim : true, required : true, unique : true},
    children : [{type : objectId, required : true}]
});

exports.Sector = mongoose.model('Sectors', sectorSchema);