var data = arguments[0] || {},
    state = data.state,
    city = data.city,
    sector = data.sector,
    query = {};

query.limit = 20;
query.page = 1;
if (sector) {
    query.filterBySectors = { sectors : [sector._id] };
}

app.ui.list.browse.remove();

var findCompanies = function(cities) {
    if (cities) {
        query.filterByCities = { cities : cities, operator : 'or' };
    }
    app.ajax.getJSON(
        {
            url : 'http://' + app.config.services.companies.host + ':' + app.config.services.companies.port + '/companies',
            data : query
        },
        function (companies) {
            for (var i in companies) {
                var company = companies[i];

                app.Browse(company);
            }
        }
    );
}

if (city) {
    findCompanies([city._id]);
} else if (state) {
    app.ajax.getJSON({
       url : 'http://' + app.config.services.location.host + ':' + app.config.services.location.port + '/country/brasil/state/'+state._id+'/cities'
    },
    function (cities) {
        var citiesList = [];
        for (var i in cities) {
            citiesList.push(cities[i]._id);
        }
        findCompanies(citiesList);
    });
}
else {
    findCompanies(undefined);
}
