/** Testes do Companies.Thumbnail
 *
 * @autor : Mauro Ribeiro
 * @since : 2012-08
 *
 * @description : Kit de testes do controller Thumbnail do serviço Companies
 */

var assert = require("assert"),
	restler = require("restler");

exports.ThumbnailTest = describe('Thumbnail', function(){
	describe('company logo', function () {
		
		beforeEach(function() {
			console.log('teste');
		});
		/*
		describe('post', function () {
			it('no path defined', function(done) {
	            restler.post('http://'+config.services.companies.host+':'+config.services.companies.port+'/image', {
	                multipart: true,
	                data: {
	                    'path': path//,
	                    //'file': restler.file(tmpFile.path, tmpFile.name, tmpFile.size, null, tmpFile.type)
	                }
	            }).on('complete', function(data) {
            		assert.isUndefined(data.error, 'no path defined');
					done();
	            });
			});
			it('no image defined', function(done) {
				
			});
			it('nice save', function(done) {
				
			});
		});
		
		describe('delete', function () {
			
		});
		
		describe('get', function () {
			
		});*/
	});
});

