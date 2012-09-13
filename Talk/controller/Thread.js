/** Thread
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de threads
 */

module.exports = function (app) {
    "use strict";

    var Model = require('./../model/Model.js'),
        auth  = require('./../Utils.js').auth,
        Conversant  = Model.Conversant,
        Thread  = Model.Thread;

    /** POST /thread
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : cadastra uma thread
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {place,name,token}
     * @response : {confirmation}
     */
    app.post('/thread', function (request, response) {
        var thread;

        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //pega os dados do post e coloca em um objeto
                            thread = new Thread({
                                place     : request.param('place', null),
                                name      : request.param('name', null),
                                status    : 'active'
                            });
                            //salva nova thread
                            thread.save(function (error) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //coloca a thread na lista de threads do criador
                                    conversant.threads.push(thread._id);
                                    conversant.save(function (error) {
                                        if (error) {
                                            response.send({error : error});
                                        } else {
                                            response.send({thread : thread});
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                response.send({error : 'invalid user or token'});
            }
        });
    });

    /** PUT /thread/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : registra usuário em uma thread
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.put('/thread/:slug', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //busca a thread
                            Thread.findOne({slug : request.params.slug}, function (error, thread) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se a thread foi encontrada
                                    if (thread === null) {
                                        response.send({error : 'thread not found'});
                                    } else {
                                        //coloca a thread na lista de threads do usuário
                                        conversant.threads.push(thread._id);
                                        //salva a modificação
                                        conversant.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({thread : thread});
                                            }
                                        });
                                    }
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

    /** GET /threads
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar threads de um usuário
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {threads}
     */
    app.get('/threads', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //busca as threads do usuário
                            conversant.activeThreads(function (error, threads) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    response.send({threads : threads});
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

    /** POST /thread/:slug/message
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : enviar mensagem
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {message,token}
     * @response : {confirmation}
     */
    app.post('/thread/:slug/message', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //busca a thread
                            Thread.findOne({slug : request.params.slug}, function (error, thread) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se a thread foi encontrada
                                    if (thread === null) {
                                        response.send({error : 'thread not found'});
                                    } else {
                                        //coloca os dados do post em um objeto
                                        thread.messages.push({
                                            content : request.param('message', null),
                                            date    : new Date(),
                                            sender  : conversant._id
                                        });
                                        //salva a mensagem
                                        thread.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                response.send({message : thread.messages.pop()});
                                            }
                                        });
                                    }
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

    /** GET /thread/:slug/messages
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : lista mensagens de uma thread
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.get('/thread/:slug/messages', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //busca a thread
                            Thread.findOne({slug : request.params.slug}, function (error, thread) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se a thread foi encontrada
                                    if (thread === null) {
                                        response.send({error : 'thread not found'});
                                    } else {
                                        response.send({messages : thread.messages});
                                    }
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

    /** GET /thread/:slug/unread-messages
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : lista mensagens não lidas de uma thread
     *
     * @allowedApp : Qualquer app
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.get('/thread/:slug/unread-messages', function (request, response) {
        response.contentType('json');

        //valida o token do usuário
        auth(request.param('token'), function (user) {
            if (user) {
                //busca o usuário
                Conversant.findOne({user : user._id}, function (error, conversant) {
                    if (error) {
                        response.send({error : error});
                    } else {
                        //verifica se o usuário foi encontrado
                        if (conversant === null) {
                            response.send({error : 'user not found'});
                        } else {
                            //busca a thread
                            Thread.findOne({slug : request.params.slug}, function (error, thread) {
                                if (error) {
                                    response.send({error : error});
                                } else {
                                    //verifica se a thread foi encontrada
                                    if (thread === null) {
                                        response.send({error : 'thread not found'});
                                    } else {
                                        //atualiza o lastCheck do usuário para mante-lo online
                                        conversant.lastCheck = new Date();
                                        conversant.save(function (error) {
                                            if (error) {
                                                response.send({error : error});
                                            } else {
                                                //busca as mensagens não lidas pelo usuário na thread
                                                thread.unreadMessages(conversant, function (messages) {
                                                    response.send({messages : messages});
                                                });
                                            }
                                        });
                                    }
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
};