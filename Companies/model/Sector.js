/** Sector
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Representação da entidade de setor
 */

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    sectorSchema,
    Sector;

sectorSchema = new Schema({
    name        : {type : String, trim : true, required : true},
    slug        : {type : String, lowercase : true , trim : true, required : true, unique : true},
    childrenIds : [{type : objectId}]
});

/** findRecursively
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Pega os setores e os filhos recursivamente
 * @param cb : callback a ser chamado após achados os setores
 * @param levels : profundidade da busca dos setores
 */
sectorSchema.statics.findRecursively = function (levels, cb) {
    //busca todos os setores do banco de dados
    //TODO fazer recursão para montar arvore de filhos
    Sector.find(cb);
};

Sector = exports.Sector = mongoose.model('Sectors', sectorSchema);