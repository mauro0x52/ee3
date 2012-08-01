/** User
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Representação da entidade de imagens
 */
 
var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    imageSchema;

imageSchema = new schema({
    path        : {type : String, trim : true, required : true},
    url         : {type : String, trim : true, required : true}
});


/** Save
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Salva imagem antes de salvar informacoes no db
 */
imageSchema.pre('save', function (next) {

});

/*  Exportando o pacote  */
exports.Image = mongoose.model('Images', imageSchema);
