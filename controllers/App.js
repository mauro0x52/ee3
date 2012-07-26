/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades autorização de aplicativos
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        User  = Model.User;

    /** POST /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Autoriza o usuário no app
     *
     * @allowedApp : WWW
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {token, confirmation}
     */
    app.post('user/:login/app/:app_id', function (request,response) {
    
    });
    
    /** DEL /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : remove autorização do usuário no app
     *
     * @allowedApp : WWW
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('user/:login/app/:app_id', function (request,response) {
    
    });
    
    /** GET /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : detalha a autorização do usuario no app
     *
     * @allowedApp : WWW, pagamento, appFinder
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {authorizationDate,  expirationDate}
     */
    app.get('user/:login/app/:app_id', function (request,response) {
    
    });
    
    /** PUT /user/:login/app/:app_id
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : edita detalhes da autorização do usuário no app
     *
     * @allowedApp : WWW, pagamento
     * @allowedUser : Logado
     *
     * @request : {authorizationDate, expirationDate}
     * @response : {confirmation}
     */
    app.get('user/:login/app/:app_id', function (request,response) {
    
    });
    
    /** GET /user/:login/app/:app_id/validate
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : valida token
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {authorizationDate, expirationDate}
     */
    app.get('user/:login/app/:app_id/validate', function (request,response) {
    
    });
    
};