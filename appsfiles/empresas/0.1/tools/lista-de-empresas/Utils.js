var Utils = {},
    app = this;

Utils.getParams = function (data, cb) {
    var params = {};
    if (data.state) {
        Utils.getState(data.state, function(state) {
            params.state = state;
            if (data.city) {
                Utils.getCity(data.state, data.city, function(city) {
                    params.city = city;
                    if (data.sector) {
                        Utils.getSector(data.sector, function (sector) {
                            params.sector = sector;
                            cb(params);
                        });
                    }
                    else {
                        cb(params);
                    }
                });
            } else {
                cb(params);
            }
        })
    }
}

Utils.getState = function (slug, cb) {
    if (slug === 'todos-os-estados' || slug === 'undefined') {
        cb(undefined);
    } else {
        app.ajax.getJSON(
            {
                url : 'http://' + app.config.services.location.host + ':' + app.config.services.location.port + '/country/brasil/state/' + slug
            },
            function (state) {
                cb(state);
            }
        );
    }
}

Utils.getCity = function (stateSlug, citySlug, cb) {
    if (citySlug === 'todas-as-cidades' || citySlug === 'undefined') {
        cb(undefined);
    } else {
        app.ajax.getJSON(
            {
                url : 'http://' + app.config.services.location.host + ':' + app.config.services.location.port + '/country/brasil/state/' + stateSlug + '/city/' + citySlug
            },
            function (city) {
                cb(city);
            }
        );
    }
}

Utils.getSector = function (slug, cb) {
    if (slug === 'undefined') {
        cb(undefined);
    } else {
        app.ajax.getJSON(
            {
                url : 'http://' + app.config.services.companies.host + ':' + app.config.services.companies.port + '/sector/' + slug
            },
            function (sector) {
                cb(sector);
            }
        );
    }
}

return Utils;