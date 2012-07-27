/** App
 * @author : Rafael Almeida Erthal Hermano
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de aplicativos
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        User  = Model.User;
        
    /** POST /app
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Cadastrar app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token,name,slug,type}
     * @response : {confirmation}
     */

    /** GET /apps
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Listar apps
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */

    /** GET /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Exibir app
     *
     * @allowedApp : Qualquer App
     * @allowedUser : Deslogado
     *
     * @request : {}
     * @response : {[name,slug,type]}
     */

    /** DEL /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Excluir app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {token}
     * @response : {confirmation}
     */

    /** PUT /app/:slug
     *
     * @autor : Rafael Erthal
     * @since : 2012-07
     *
     * @description : Editar app
     *
     * @allowedApp : sdk
     * @allowedUser : Logado
     *
     * @request : {}
     * @response : {}
     */
};