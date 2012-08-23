/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Biblioteca de utilidades
 */
var config = require('./config.js');

/** Auth
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : valida o token de um usuário no serviço Auth
 * @param login : username do usuário
 * @param token : token do usuário
 * @param cb : callback a ser chamado após validado o token
 */
exports.auth = function (token, cb) {
    "use strict";

    var http = require('http'),
        options = {
            host: config.services.auth.host,
            path: '/user/validate?token=' + token,
            port: config.services.auth.port,
            method: 'GET'
        };

    http.request(options, function (answer) {
        var str = '';
        //pega os dados recebidos via streaming
        answer.on('data', function (chunk) {
            str += chunk;
        });
        //ao terminar o recebimentos dos dados, chamar o callback com a resposta se o usuário foi ou não autenticado
        answer.on('end', function () {
            var response = JSON.parse(str);
            if (response.error) cb(undefined);
            else cb(response);
        });
    }).end();
};

exports.files = {
    image: {
        upload : function (file, path, cb) {
            "use strict";
            // arquivo da imagem temporaria
            var tmpFile = file;
            var restler = require('restler');
            // envia o arquivo para o servico Files
            restler.post('http://'+config.services.files.host+':'+config.services.files.port+'/image', {
                multipart: true,
                data: {
                    'path': path,
                    'file': restler.file(tmpFile.path, tmpFile.name, tmpFile.size, null, tmpFile.type)
                }
            }).on('success', function(data) {
                cb(undefined, data);
            }).on('error', function(error) {
                cb(error, undefined);
            });
        },
        thumbnail : {
            upload : function (file, path, cb) {
                "use strict";
                // arquivo da imagem temporaria
                var tmpFile = file;
                var restler = require('restler');


                var restler = require('restler');
                var restler1 = require('restler');
                var restler2 = require('restler');
                var restler3 = require('restler');
                var resizeUrl = 'http://'+config.services.files.host+':'+config.services.files.port+'/image/resize',
                    sendUrl = 'http://'+config.services.files.host+':'+config.services.files.port+'/image',
                    resultHandler,
                    processed = 0,
                    imagesList = {},
                    originalPath;

                // envia o arquivo para o servico Files
                restler.post(sendUrl, {
                    multipart: true,
                    data: {
                        'path': path,
                        'file': restler.file(tmpFile.path, tmpFile.name, tmpFile.size, null, tmpFile.type)
                    }
                }).on('success', function(data) {
                    if (data.error) {
                        cb(data.error);
                    } else {
                        originalPath = data.path;
                        imagesList.original = data;


                        // thumbnail de 50 px
                        restler.post(resizeUrl, {
                            data: {
                                'file' : originalPath,
                                'width' : 50,
                                'height' : 50,
                                'label' : 'small',
                                'style' : 'extend'
                            }
                        })
                        .on('success', function (data) {
                            imagesList.small = data;
                            // thumbnail de 100 px
                            restler.post(resizeUrl, {
                                data: {
                                    'file' : originalPath,
                                    'width' : 100,
                                    'height' : 100,
                                    'label' : 'medium',
                                    'style' : 'extend'
                                }
                            })
                            .on('success', function (data) {
                                imagesList.medium = data;
                                // thumbnail de 200 px
                                restler.post(resizeUrl, {
                                    data: {
                                        'file' : originalPath,
                                        'width' : 200,
                                        'height' : 200,
                                        'label' : 'large',
                                        'style' : 'extend'
                                    }
                                })
                                .on('success', function (data) {
                                    imagesList.large = data;
                                    cb(undefined, imagesList);
                                })
                                .on('error', function(error) {
                                    cb(error);
                                });
                            })
                            .on('error', function(error) {
                                cb(error);
                            });
                        })
                    }
                }).on('error', function(error) {
                    cb(error);
                });

            }
        }
    }
}