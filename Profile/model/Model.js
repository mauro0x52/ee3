/** Model
 * @author : Lucas Kalado
 * @since : 2012-07
 *
 * @description : Montagem da model
 */
var config   = require('./../config.js'),
    mongoose = require('mongoose');

/*  Conectar com o banco de dados  */
mongoose.connect('mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.url + ':' + config.mongodb.port + '/' + config.mongodb.db);

/*  Exportar name-space  */
exports.Job = require('./Job.js').Job;
exports.Profile = require('./Profile.js').Profile;
exports.Thumbnail = require('./Thumbnail.js').Thumbnail;
exports.Image = require('./Image.js').Image;
exports.Phone = require('./Phone.js').Phone;
exports.Link = require('./Phone.js').Link;
exports.Contact = require('./Contact.js').Contact;