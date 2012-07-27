/** Model
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Montagem da model
 */
 
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.Country = require('./Country.js').Country;
exports.State = require('./State.js').State;
exports.City = require('./City.js').City;
exports.Region = require('./Region.js').Region;