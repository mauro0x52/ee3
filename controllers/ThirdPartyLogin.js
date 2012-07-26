/** ThirstPartyLogin
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de contas externas de um usuário
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        User  = Model.User;

    /** POST /user/:login/third-party-login
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastra login externo do usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {server}
     * @response : {confirmation}
     */
    app.post('user/:login/third-party-login', function (request,response) {
    
    });
     
    /** GET /user/:login/third-party-logins
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : lista logins externos do usuário
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {[{server}]}
     */
    app.get('user/:login/third-party-logins', function (request,response) {
    
    });
     
    /** GET /user/:login/third-party-login/:server
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : pega login externo
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {server}
     */
    app.get('user/:login/third-party-login/:server', function (request,response) {
    
    });
     
    /** DEL /user/:login/third-party-login/:server
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : remove login externo
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */
    app.del('user/:login/third-party-login/:server', function (request,response) {
    
    });
};