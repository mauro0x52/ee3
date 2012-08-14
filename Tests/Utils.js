/** Utils
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');
var restler = require('restler');

var api = {
	get : function(service, url, data, cb) {
        restler.get('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data) {
			cb(undefined, data);
        }).on('error', function(error) {
        	cb(error);
        });
	},
	post : function(service, url, data, cb) {
        restler.post('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data) {
			cb(undefined, data);
        }).on('error', function(error) {
        	cb(error);
        });
	},
	put : function(service, url, data, cb) {
        restler.put('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data) {
			cb(undefined, data);
        }).on('error', function(error) {
        	cb(error);
        });
	},
	del : function(service, url, data, cb) {
        restler.del('http://'+config.services[service].host+':'+config.services[service].port+url, {
            data: data
        }).on('complete', function(data) {
			cb(undefined, data);
        }).on('error', function(error) {
        	cb(error);
        });
	},
	file : function(service, url, data, file, cb) {
        restler.post('http://'+config.services[service].host+':'+config.services[service].port+url, {
            multipart: true,
            data: data
        }).on('complete', function(data) {
			cb(undefined, data);
        }).on('error', function(error) {
        	cb(error);
        });
	},
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