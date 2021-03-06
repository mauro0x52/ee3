/*global sdk: false, document: false, eval: false, console:false*/

/** app
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : controlador de carregamento de aplicativos
 */
sdk.modules.apps = function () {
    "use strict";

    var ajax = new sdk.modules.ajax(this),
        config = sdk.config;

    /** App
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : representa a entidade aplicativo do banco
     * @param name : nome do aplicativo
     * @param slug : slug do aplicativo
     * @param creator : id do usuario que criou o aplicativo
     * @param type : tipo do aplicativo
     * @param _id : id do aplicativo
     */
    var App = function (app) {
        this.name = app.name;
        this.slug = app.slug;
        this.creator = app.creator;
        this.type = app.type;
        this._id = app._id;

        /** Versions
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : lista todas as versões de um aplicativo
         * @param cb : callback a ser chamado após encontradas as versões
         */
        this.versions = function (cb) {
            ajax.getJSON({
                url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + this.slug + '/versions'
            }, function (response) {
                var i,
                    versions = [];

                for (i = 0; i < response.versions.length; i++) {
                    versions.push(new Version(response.versions[i], app.slug));
                }
                cb(versions);
            });
        }
    };

    /** Version
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : representa a entidade versão de aplicativo do banco
     * @param number : número da versão
     * @param app_slug : slug do aplicativo
     * @param _id : id da versão
     */
    var Version = function (version, app_slug) {
        this.number = version.number;
        this.app = app_slug;
        this._id = version._id;
        var number = this.number;

        /** Tools
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : lista todas as ferramentas de uma versão
         * @param cb : callback a ser chamado após encontradas as ferramentas
         */
        this.tools = function (cb) {
            ajax.getJSON({
                url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + this.app + '/version/' + this.number + '/tools'
            }, function (response) {
                var i,
                    tools = [];

                for (i = 0; i < response.tools.length; i++) {
                    tools.push(new Tool(response.tools[i], number, app_slug));
                }
                cb(tools);
            });
        }
    };

    /** Tool
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : representa a entidade ferramenta de aplicativo do banco
     * @param name : nome da ferramenta
     * @param source : código da ferramenta
     * @param slug : slug da ferramenta
     * @param _id : id da ferramenta
     */
    var Tool = function (tool, version_slug, app_slug) {
        this.name = tool.name;
        this.source = tool.source;
        this.slug = tool.slug;
        this._id = tool._id;
        var that = this;

        /** Load
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : monta o contexto e carrega a ferramenta
         */
        this.load = function () {
            document.getElementById('tool-name').innerHTML = this.name;
            ajax.getJSON({
                url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + app_slug + '/version/' + version_slug + '/tool/' + this.slug
            }, function (app) {
                that.build();
            })
        };

        /** Build
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : adiciona extensões do sdk na ferramenta
         */
        this.build = function () {
            var prop,
                document = undefined,
                window = undefined,
                navigator = undefined,
                screen = undefined,
                history = undefined,
                location = undefined,
                alert = undefined,
                prompt = undefined,
                confirm = undefined,
                header = undefined,
                app;

            eval(this.source);
            app.slug = this.slug;
            
            for (prop in sdk.modules) {
                if (sdk.modules.hasOwnProperty(prop)) {
                    if (prop !== 'app') {
                        app[prop] = new sdk.modules[prop](app);
                    }
                }
            }
            app.config = sdk.config;    
            
            try {
                if (app.Load) {
                    app.Load();
                    //app.route.hash(" ");
                } else {
                    console.error('loader undefined');
                }
            } catch (error) {
                console.error(error);
            }
        };
    };

    /** ListAllApps
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : lista todas os aplicativos autenticados de um usuário
     * @param user : usuário
     * @param cb : callback a ser chamado após encontrados os aplicativos
     */
    this.listAllApps = function (user, cb) {
        ajax.getJSON({
            url : 'http://' + config.services.auth.host + ':' + config.services.auth.port + '/user/' + user.login + '/apps',
            data : {token : user.token}
        }, function (response) {
            var handled = 0,
                i,
                apps = [];

            if (response.error) {
                console.error(JSON.stringify(response.error));
            } else {
                for (i = 0; i < response.length; i++) {
                    ajax.getJSON({
                        url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/app/' + response[i]
                    }, function (app) {
                        handled++;

                        if (app.error) {
                            console.error(app.error);
                        } else {
                            apps.push(new App(app));
                        }

                        if (handled === response.length) {
                            cb(apps);
                        }
                    });
                }
            }
        });
    };

    /** ListCompulsoryApps
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : lista todas os aplicativos autenticados de um usuário
     * @param user : usuário
     * @param cb : callback a ser chamado após encontrados os aplicativos
     */
    this.listCompulsoryApps = function (cb) {
        ajax.getJSON({
            url : 'http://' + config.services.apps.host + ':' + config.services.apps.port + '/apps'
        }, function (response) {
            var handled = 0,
                i,
                apps = [];

            if (response.error) {
                console.error(JSON.stringify(response.error));
            } else {
                for (i = 0; i < response.apps.length; i++) {
                    if (response.apps[i].type === 'compulsory') {
                        apps.push(new App(response.apps[i]));
                    }
                }
                cb(apps);
            }
        });
    };
};