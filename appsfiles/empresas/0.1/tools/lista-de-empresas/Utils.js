var Utils = {};


Utils.getCompany = function (company, cb) {
    if (typeof(company) === 'string') {
        new app.ajax.getJSON({
            url : 'http://' + app.config.services.companies.host + ':' + app.config.services.companies.port + '/company/' + company,
            data : {
                attributes : {
                    products : true,
                    addresses : true,
                    phones : true,
                    about : true,
                    embeddeds : true,
                    links : true
                }
            }
        }, function (company) {
            cb(company);
        });
    } else {
        cb(company);
    }
}

Utils.getParams = function (data, cb) {
    var params = {};
    if (data.state) {
        Utils.getStateBySlug(data.state, function(state) {
            params.state = state;
            if (data.city) {
                Utils.getCityBySlug(data.state, data.city, function(city) {
                    params.city = city;
                    if (data.sector) {
                        Utils.getSectorBySlug(data.sector, function (sector) {
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

Utils.getStateBySlug = function (slug, cb) {
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

Utils.getCityBySlug = function (stateSlug, citySlug, cb) {
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

Utils.getSectorBySlug = function (slug, cb) {
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



Utils.getCityById = function (cityId, cb) {
    app.ajax.getJSON(
        {
            url : 'http://' + app.config.services.location.host + ':' + app.config.services.location.port + '/city/' + cityId
        },
        function (data) {
            cb(data);
        }
    );
}

return Utils;