/** Profile
 * @author : Lucas Kalado
 * @since : 2012-08
 *
 * @description : Módulo que implementa as funcionalidades de profiles de usuários
 */
 
module.exports = function (app) {
    var Model = require('./../model/Model.js'),
        auth = require('./../Utils.js').auth,
        Profile = Model.Profile;
        
    /** GET /profile/:slug/phones
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Visualiza todos os telefones de um Profile
     *
     * @allowedApp : Qualquer APP
     * @allowedUser : Público
     *
     * @request : {}
     * @response : {type, number, extension, areaCode, intCode}
     */
    app.get('/profile/:slug/phones', function (request,response) {
        response.contentType('json');
        
        //Verifica se existe o parametro Slug
        if (request.params.slug) {
            //Localiza o Profile
            Profile.findOne({"slugs.name" : request.params.slug},['phones'], function (error, profile) {
                if (error) {
                    response.send({error: error});
                } else {
                    //Envia os telefones do Profile
                    response.send({Phones: profile['phones']});
                }
            });
        } else {
            response.send({error: "É necessário o envio de uma slug"});
        }
    });
    
    /** POST /profile/:slug/phone
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Cadastra novo phone
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {type, number, extension, areaCode, intCode, login, token}
     * @response : {this}
     */
    app.post('/profile/:slug/phone', function (request,response) {
        var profile;
        
        response.contentType('json');
        
        //Verifica se existe o parametro Slug
        if (request.params.slug) {
            //Localiza o Profile
            Profile.findOne({"slugs.name" : request.params.slug}, function (error, profile) {
                if (error) {
                    response.send({error: error});
                } else {
                    //Verifica se o Profile foi encontrado
                    if (profile) {
                        //prepara o phone enviado para adicionar ao Model
                        profile.phones.push({
                            "type"      : request.param('type'),
                            "number"    : request.param('number'),
                            "extension" : request.param('areacode'),
                            "intCode"   : request.param("intcode")
                        });
                        
                        profile.save(function (error) {
                            if (error) {
                                response.send({error : error});
                            } else {
                                response.send({Profile : profile['phones']});
                            }
                        });
                    } else {
                        response.send({error: "Profile não encontrado."});
                    }
                }
            });
        } else {
            response.send({error: "É necessário o envio de uma slug"});
        }
    });
    
    /** PUT /profile/:slug/phone/{id}
     *
     * @autor : Lucas Kalado
     * @since : 2012-08
     *
     * @description : Edita um phone
     *
     * @allowedApp : Profiles
     * @allowedUser : Logado
     *
     * @request : {type, number, extension, areaCode, intCode, login, token}
     * @response : {this}
     */
    app.put('/profile/:slug/phone/:id', function (request,response) {
        var profile;
        
        response.contentType('json');
        
        //Verifica se existe o parametro Slug
        if (request.params.slug) {
            //Localiza o Profile
            Profile.findOne({"phones._id" : request.params.id}, ['phones'], function (error, profile) {
                if (error) {
                    response.send({error: error});
                } else {
                    //Verifica se o Profile foi encontrado
                    if (profile) {
                        var i = 0;
                        for (var phone in profile.phones) {
                            if (phone._id === request.params.id) {
                                phone.type = request.param('type');
                                phone.number = request.param('number');
                                phone.extension = request.param('extension');
                                phone.areacode = request.param('areacode');
                                phone.intcode = request.param('intcode');
                                
                                profile.phones[i] = phone;
                            }
                            i++;
                        };
                    } else {
                        response.send({error: "Profile não encontrado."});
                    }
                }
            });
        } else {
            response.send({error: "É necessário o envio de uma slug"});
        }
    });
};