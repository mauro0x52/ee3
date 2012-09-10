var data = arguments[0] || {},
    app = this,
    state = data.state && data.state !== 'undefined' ? data.state : undefined,
    city = data.city && data.city !== 'undefined' ? data.city : undefined,
    sector = data.sector && data.sector !== 'undefined' ? data.sector : undefined,
    query = {};

query.limit = 20;
query.page = 1;
if (sector) {
    query.filterBySectors = { sectors : [sector] };
}

this.ui.list.browse.remove();

var findCompanies = function(cities, sector) {
    if (cities) {
        query.filterBySectors = { cities : cities, operator : 'or' };
    }
    app.ajax.getJSON(
        {
            url : 'http://' + app.config.services.companies.host + ':' + app.config.services.companies.port + '/companies',
            data : query
        },
        function (companies) {
            for (var i in companies) {
                var company = companies[i];

                if (!company.thumbnail || !company.thumbnail.small || !company.thumbnail.small.url) {
                    company.thumbnail = { small :
                        {
                            url : 'http://static2.worldofwonder.net/wp-content/uploads/2012/08/cdn.tvlia_.com_.files_.2010.05.alf2_.jpg',
                            legend : 'imagem padrão'
                        }
                    }
                }
                this.Browse(company);
            }
        }
    );
}


if (state && !city) {
    this.ajax.getJSON({
       url : 'http://' + this.config.services.location.host + ':' + this.config.services.location.port + '/country/brasil/state/'+state+'/cities'
    },
    function (cities) {
        var citiesList = [];
        for (var i in cities) {
            citiesList.push(cities[i]._id);
        }
        findCompanies(citiesList, sector);
    });
}
else {
    findCompanies([city], sector);
}
