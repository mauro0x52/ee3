/** Model
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.Company = require('./Company.js').Company;
exports.Sector  = require('./Sector.js').Sector;
/*
exports.Address  = require('./Address.js').Address;
exports.Contact  = require('./Contact.js').Contact;
exports.Embedded  = require('./Embedded.js').Embedded;
exports.Image  = require('./Image.js').Image;
exports.Link  = require('./Link.js').Link;
exports.Phone  = require('./Phone.js').Phone;
exports.Product  = require('./Product.js').Product;
exports.Sector  = require('./Sector.js').Sector;
exports.Thumbnail  = require('./Thumbnail.js').Thumbnail;
*/