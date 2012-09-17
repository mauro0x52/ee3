var sdk,
    empreendemia;

/** JsonToQuery
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : converte um objeto jSon em query
 * @param obj : objeto que vai ser passado para string
 * @param label : label do objeto
 */
function jsonToQuery (obj, label) {
    var query_string = "",
        key;

    if (typeof obj === 'number' || typeof obj === 'string') {
        if (label){
            query_string += label + '=' + escape(obj) + '&';
        } else {
            query_string = escape(obj) + "&";
        }
    } else {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                query_string += jsonToQuery(obj[key], (label ? label + '[' + escape(key) + ']' : escape(key))) + '&';
            }
        }
    }
    return query_string.slice(0, query_string.length - 1);
};

/** QueryToJson
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : converte a query em JSON
 */
function queryToJson (value) {
    var res = {};

    value.replace(/#!\/[a-z,0-9,-]+\/[a-z,0-9,\-,\/]+[a-z,0-9]\/?\??/, '')
        .replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) {res[$1] = $3;}
        );
    return res;
};

/** AjaxRequest
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : realiza chamada AJAX 
 * @param url : endereço a ser chamado pelo http
 * @param method : método da chamada AJAX
 * @param data : data a ser enviada pela chamada AJAX
 * @param cb : callback a ser chamado com a informação
 */
function ajaxRequest (url, method, data, cb) {
    var invocation;

    try {
        /* Testa chamada para o IE */
        if (window.XDomainRequest) {
            invocation = new window.XDomainRequest();
        } else if (XMLHttpRequest) {
            invocation = new XMLHttpRequest();
        }
        /* Verifica se ajax esta disponível no browser */
        if (invocation) {
            /* Callback de sucesso */
            invocation.onload = function () {
                if (cb) {
                    cb(invocation.responseText);
                }
            };
            /* Callback de falha */
            invocation.onerror = function (error) {
                console.error(error);
            };
            /* dispara a chamada */
            invocation.open(method, url + "?" + jsonToQuery(data), true);
            invocation.send();
        } else {
            console.error('unable to create request object');
        }
    } catch (error) {
        console.error(error);
    }
}
/** GetCookie
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : pega um cookie do navegador
 * @param c_name : nome do cookie
 */
function getCookie(c_name)
{
    var i,
        x,
        y,
        ARRcookies = document.cookie.split(";"),
        res;

    for (i=0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g,"");

        if (x==c_name) {
            res = unescape(y);
        }
    }
    return res;
}
/** SetCookie
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : insere um cookie do navegador
 * @param c_name : nome do cookie
 * @param value : valor do cookie
 * @param exdays : periodo de expiração do cookie
 */
function setCookie(c_name,value,exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);

    var c_value = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

/** empreendemia
 *
 * @autor : Rafael Erthal
 * @since : 2012-09
 *
 * @description : javascript do corpo da empreendemia
 */
empreendemia = {
    user : {},

    /** loadModules
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : carrega módulos externos no www
     * @param modules[] : nome dos arquivos que contem os módulos
     * @param cb : callback a ser chamado após todos os módulos terem sido carregados
     */
    loadModules : function (modules, cb) {
        "use strict";

        var i,
            handled = 0,
            handler;

        //tratador de respostas
        handler = function (data) {
            handled++;
            eval(data);
            /* verifica se todos os módulos ja foram carregados */
            if (handled >= modules.length) {
                cb.apply(empreendemia);
            }
        };

        for (i = 0; i < modules.length; i = i + 1) {
            ajaxRequest(modules[i], 'GET', {}, handler);
        }
    }
};

(function () {
    "use strict";

    empreendemia.loadModules(['sdk/sdk.js', 'js/menu.js', 'js/start.js'], function (error) {
        sdk.loadModules(['sdk/ajax.js', 'sdk/tracker.js', 'sdk/ui.js', 'sdk/app.js', 'sdk/route.js'], function (error) {
            empreendemia.start();
        });
    });
}());