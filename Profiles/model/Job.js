/** Job
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Representação da entidade de Jobs
 */
 var mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    jobSchema;
 
jobSchema = new schema({
    name        : {type : String, required : true, trim : true},
    company     : {type : objectId},
    companyName : {type : String, trim : true},
    description : {type : String},
    dateStart   : {type : Date},
    dateEnd     : {type : Date}
});

/*  Exportando o pacote  */
exports.Job = jobSchema;