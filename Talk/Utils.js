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
            if (response.error) {
                cb(response.error, undefined);
            } else {
                response.error = undefined;
                cb(undefined, response.user);
            }
        });
    }).end();
};