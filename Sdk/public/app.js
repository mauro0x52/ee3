/*global sdk: false, document: false, eval: false, console:false*/

/** app
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : controlador de carregamento de aplicativos
 */
sdk.modules.app = function (sdk) {
    "use strict";

    var ajax = new sdk.modules.ajax(this);

    this.tool = function (app, version, tool) {
        ajax.get({url : 'http://' + sdk.config.apps.host + ':' + sdk.config.apps.port + '/app/' + app + '/version/' + version + '/tool/' + tool}, function (data) {
            var response;
            eval("response = " + data);
            if (response.error && response.error !== '') {
                console.error(response.error);
            } else {
                this.load(response.tool.source);
            }
        });
    };

    this.load = function (source) {
        var document = undefined,
            window = undefined,
            navigator = undefined,
            screen = undefined,
            history = undefined,
            location = undefined,
            alert = undefined,
            prompt = undefined,
            confirm = undefined,
            sdk = undefined;

        console.spacer();
        console.log("Building app");
        eval(source);
        this.build(app);
        console.log("Loading app");
        try {
            if (app.load) {
                app.load();
            } else {
                console.error('loader undefined');
            }
        } catch (error) {
            console.error(error);
        }
    };

    this.build = function (app) {
        var prop;

        for (prop in sdk.modules) {
            if (sdk.modules.hasOwnProperty(prop)) {
                if (prop === 'app') {
                    app[prop] = new sdk.modules[prop](sdk);
                } else {
                    app[prop] = new sdk.modules[prop](app);
                }
            }
        }
        app.config = sdk.config;
    };
};