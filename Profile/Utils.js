/** Utils
 *
 * @autor : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Biblioteca de utilidades
 */
module.exports = {
    
    /** Auth
     * @author : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida o token de um usuário no serviço Auth
     * @param login : username do usuário
     * @param token : token do usuário
     * @param cb : callback a ser chamado após validado o token
     */
    auth : function (login, token, cb) {
        var http = require('http'),
            options = {
                host: 'localhost',
                path: '/user/' + login + '/validate?token=' + token,
                port: '3300',
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
                cb(response.valid);
            });
        }).end();
    },
    
    getIdUser : function (login, token, cb) {
        
    }
};