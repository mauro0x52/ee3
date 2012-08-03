/** User
 * @author : Rafael Erthal & Mauro Ribeiro & Lucas Kalado
 * @since : 2012-07
 *
 * @description : Representação da entidade de usuários
 */

var crypto = require('crypto'),
    config = require('./../config.js'),
    mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    objectId = Schema.ObjectId,
    userSchema,
    User;

userSchema = new Schema({
    username         : {type : String, trim : true, required : true},
    password         : {type : String, required : true},
    token            : {type : String, trim : true},
    status           : {type : String, required : true, enum : ['active', 'inactive']},
    thirdPartyLogins : [require('./ThirdPartyLogin').ThirdPartyLogin],
    authorizedApps   : [require('./AuthorizedApp').AuthorizedApp]
});

/** pre('save')
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : verifica se o username ainda não foi cadastrado
 */
userSchema.pre('save', function (next) {
    "use strict";

    User.findOne({username : this.username}, function (error, user) {
        if (error) {
            next(error);
        } else {
            if (user === null) {
                next();
            } else {
                next('username already exists');
            }
        }
    });
});

/** GenerateToken
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Gera o token do usuário
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.generateToken = function () {
    "use strict";

    return crypto.createHash('md5', config.security.token).update(this.login + this.password).digest('hex');
};

/** CheckToken
 * @author : Rafael Erthal
 * @since : 2012-07
 *
 * @description : Verifica se o token passado é correo
 * @param cb : callback a ser chamado após a ativação da conta
 */
userSchema.methods.checkToken = function (token, cb) {
    "use strict";

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
    "use strict";

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
    "use strict";

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
    "use strict";

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
    "use strict";

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
    "use strict";

    this.password = password;
    this.save(cb);
};

/** FindAuthorizedApp
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : busca uma autorização de app do usuário
 * @param id : id do app
 * @param cb : callback a ser chamado após localizado o app
 */
userSchema.methods.findAuthorizedApp = function (id, cb) {
    "use strict";

    for (i = 0; i < this.authorizedApps.length; i = i + 1) {
        if (this.authorizedApps[i].appId === id) {
            cb(undefined, this.authorizedApps[i]);
        }
    }
    cb('app not found', null);
};

/** FindThirdPartyLogin
 * @author : Rafael Erthal
 * @since : 2012-08
 *
 * @description : busca um login externo do usuário
 * @param id : server do login externo
 * @param cb : callback a ser chamado após localizado o login externo
 */
userSchema.methods.findThirdPartyLogin = function (server, cb) {
    "use strict";

    for (i = 0; i < this.thirdPartyLogins.length; i = i + 1) {
        if (this.thirdPartyLogins[i].server === server) {
            cb(undefined, this.thirdPartyLogins[i]);
        }
    }
    cb('third party login not found', null);
};

/*  Exportando o pacote  */
User = exports.User = mongoose.model('Users', userSchema);