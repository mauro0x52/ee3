/** Conversant
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de usuário
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Conversant  = Model.Conversant;

    /** POST /conversant
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Registrar usuário no talk
     *
     * @allowedApp : WWW
     * @allowedUser : Público
     *
     * @request : {login,token,label}
     * @response : {confirmation}
     */
    app.post('/conversant', function (request, response) {
        var conversant;

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('login', null), request.param('token', null), function (valid) {
            if (valid) {
                //pega os dados do post e coloca em um novo objeto.
                conversant = new Conversant({
                    user      : request.param('login', null),
                    label     : request.param('label', null),
                    lastCheck : new Date()
                });
                //salva novo usuário
                conversant.save(function (error) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        response.send({error : ''});
                    }
                });
            } else {
                response.send({error : 'invalid user or token'});
            }
        });
    });

    /** PUT /conversant/:user/change-label
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Muda label do usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {token, new_label}
     * @response : {confirmation}
     */
    app.put('/conversant/:user/change-label', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.params.user, request.param('token', null), function (valid) {
            if (valid) {
                //busca o usuário
                Conversant.findOne({user : request.params.user}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //modifica a label
                            conversant.label = request.param('new_label', null);
                            //salva modificação
                            conversant.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({error : ''});
                                }
                            });
                        }
                    }
                });
            } else {
                response.send({error : 'invalid token'});
            }
        });
    });

    /** GET /conversant/:user_id/status
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Consultar status de usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {status}
     */
    app.get('/conversant/:user_id/status', function (request, response) {
        response.contentType('json');

        //busca usuário
        Conversant.findOne({user : request.params.user_id}, function (error, conversant) {
            if (error) {
                response.send({error : error});
            } else {
                //verifica se o usuário foi encontrado
                if (conversant === null) {
                    response.send({error : 'conversant not found'});
                } else {
                    conversant.isOnline(function (isOnline) {
                        if (isOnline) {
                            response.send({status : 'online'});
                        } else {
                            response.send({status : 'offline'});
                        }
                    });
                }
            }
        });
    });
};