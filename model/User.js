/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de usuários
 */
 
var crypto = require('crypto'),
    mongoose = require('mongoose'),
    schema   = mongoose.Schema,
    objectId = schema.ObjectId,
    userSchema, User;

userSchema = new schema({
    username         : {type : String, trim : true, required : true},
    password         : {type : String, required : true},
    token            : {type : String, trim : true},
    status           : {type : String, required : true, enum : ['active', 'inactive']},
    thirdPartyLogins : [require('./ThirdPartyLogin')],
    authorizedApps   : [require('./AuthorizedApp')],
});

/** GenerateToken
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Gera o token do usuário
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.generateToken = function () {
    return crypto.createHash('md5', config.security.token).update(this.login + this.password).digest('hex');
};

/** CheckToken
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Verifica se o token passado é correo
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.checkToken = function (token,cb) {
    cb(token === this.generateToken());
};

/** Activate
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Ativa a conta do usuário
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.activate = function (cb) {
    this.status = 'active';
    this.save(cb);
};

/** Deactivate
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Desativa a conta do usuário
 * @param cb : callback a ser chamado após a desativação da conta
 */
userSchema.methods.deactivate = function (cb) {
    this.status = 'inactive';
    this.save(cb);
};

/** Login
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Loga o usuário no sistema
 * @param cb : callback a ser chamado após o usuário ser logado
 */
userSchema.methods.login = function (cb) {
    this.token = this.generateToken();
    this.save(cb);
};

/** Logout
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Desloga o usuário no sistema
 * @param cb : callback a ser chamado após o usuário ser deslogado
 */
userSchema.methods.logout = function (cb) {
    this.token = undefined;
    this.save(cb);
};

/** ChangePassword
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Muda a senha de um usuário do sistema
 * @param password : nova senha do usuário
 * @param cb : callback a ser chamado após a mudança da senha
 */
userSchema.methods.changePassword = function (password, cb) {
    this.password = password;
    this.save(cb);
};

/*  Exportando o pacote  */
exports.User = mongoose.model('Users', userSchema);