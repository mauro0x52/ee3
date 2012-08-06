function ajax(params)
{
    var app = params.app,
        success,
        error,
        url,
        call,
        parseQuery;

    parseQuery = function (obj, label) {
        "use strict";

        var query_string = "";
        
        for (var key in obj) {
            if (typeof obj[key] !== 'object') {
                query_string += (label ? label+"." : "") + escape(key) + '=' + escape(obj[key]) + '&';
            } else {
                query_string += parseQuery(obj[key], (label ? label + "." : "") + key) + '&';
            }
        }
        return query_string.slice(0, query_string.length - 1);
    };

    call = function (params) {
        var invocation;

        success = params.success;
        error = params.error;
        url = params.url + "?" + parseQuery(params.data);

        try {
            if (window.XDomainRequest) {
                invocation = new window.XDomainRequest();
                if (invocation) {
                    invocation.onload = function () {
                        if(app.success){
                            app.success(invocation.responseText);
                        } else {
                            success.apply(app, [invocation.responseText]);
                        }
                    };
                    invocation.open(params.method, url, true);
                    invocation.send();
                } else {
                    console.error("Objeto de requisição não pode ser criado");
                }
            } else {
                invocation = new XMLHttpRequest();
                if (invocation) {
                    invocation.onreadystatechange = function () {
                        if (invocation.readyState == 4) {
                            if (invocation.status == 200) {
                                if(app.success) {
                                    app.success(invocation.responseText);
                                } else {
                                    success.apply(app, [invocation.responseText]);
                                }
                            } else {
                                console.error("Algo deu errado.");
                            }
                        }
                    };
                    invocation.open('GET', url, true);
                    invocation.send();
                } else {
                    console.error("Objeto de requisição não pode ser criado");
                }
            }
        } catch(e) {
            console.error(e);
        }
    };

    this.get = function (params) {
        call({
            success : params.success,
            url     : params.url,
            data    : params.data,
            method  : 'GET'
        });
    };

    this.post = function (params) {
        call({
            success : params.success,
            url     : params.url,
            data    : params.data,
            method  : 'POST'
        });
    };

    this.put = function (params) {
        call({
            success : params.success,
            url     : params.url,
            data    : params.data,
            method  : 'PUT'
        });
    };

    this.del = function (params) {
        call({
            success : params.success,
            url     : params.url,
            data    : params.data,
            method  : 'DELETE'
        });
    };
};