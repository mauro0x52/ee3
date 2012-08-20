/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');
var restler = require('restler');
var fs = require('fs');

var api = {
    get : function(service, url, data, cb) {
        restler.get('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data, response) {
            cb(undefined, data, response);
        });
    },
    post : function(service, url, data, cb) {
        restler.post('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data, response) {
            cb(undefined, data, response);
        });
    },
    put : function(service, url, data, cb) {
        restler.put('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data, response) {
            cb(undefined, data, response);
        });
    },
    del : function(service, url, data, cb) {
        restler.del('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data, response) {
            cb(undefined, data, response);
        });
    },
    file : function(service, url, data, files, cb) {

        var fs = require('fs'),
            mime = require('mime');

        for (var i in files){
            var stat = fs.statSync(__dirname + '/static/' + files[i]);
            data[i] = restler.file(__dirname + '/static/'+files[i], files[i], stat.size, null, mime.lookup('../static/'+files[i]));
        }

        restler.post('http://'+config.services[service].host+':'+config.services[service].port+url, {
            multipart: true,
            data: data
        }).on('complete', function(data, response) {
            cb(undefined, data, response);
        });/*.on('error', function(error) {
            cb(error);
        });*/
    }
}

exports.api = api;

var db = {
    openCollection : function (service, collection, cb) {
        var mongodb = require("mongodb"),
            mongoserver = new mongodb.Server(config.services[service].mongodb.url, config.services[service].mongodb.port),
            connector = new mongodb.Db(config.services[service].mongodb.db, mongoserver);

        connector.open(function (error, db) {
            db.collection(collection, function (error, collection) {
                cb(error, collection);
            });
        });
    },
    dropCollection : function (service, collection, cb) {
        db.openCollection(service, collection, function(error, collection) {
            collection.remove({}, cb(error));
        });
    }
}

exports.db = db;

var rand = function(type) {
    var crypto = require('crypto');
    var string;
    var hash = crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 5);

    if (type === 'email') {
        string = 'testes+' + hash + '@empreendemia.com.br';
    } else {
        string = hash;
    }
    return string;
}

exports.rand = rand;