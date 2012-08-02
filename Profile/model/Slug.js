/** Job
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de Jobs
 */
 
var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    slugSchema;
    
slugSchema = new schema({
    name : {type : String, trim : true}
});

/*  Exportando o pacote  */
exports.Slug = slugSchema;