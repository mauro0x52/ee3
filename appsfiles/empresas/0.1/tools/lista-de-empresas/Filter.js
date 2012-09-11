var params = arguments[0] || {},
    query = arguments[1] || {},
    app = this;

this.ui.list.filter.remove();

/**
 * Select box de setores
 */
this.ajax.getJSON(
    {
        url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/sectors'
    },
    function (sectors) {
        var sectors_list = [];
        sectors_list.push({label : 'escolha um setor'});
        for (var i in sectors) {
            if (params.sector && sectors[i].slug === params.sector.slug) {
                sectors_list.push({label : sectors[i].name, value : sectors[i].slug, selected : true});
            }
            else {
                sectors_list.push({label : sectors[i].name, value : sectors[i].slug});
            }
        }
        this.ui.list.filter.add(
            {type : 'select', name : 'sector', label : 'Setor', options : sectors_list}
        );
    }
);


/**
 * Select box de estados
 */
this.ajax.getJSON(
    {
        url : 'http://' + this.config.services.location.host + ':' + this.config.services.location.port + '/country/brasil/states/'
    },
    function (states) {
        var states_list = [];
        states_list.push({label : 'escolha um estado'});
        for (var i in states) {
            if (params.state && states[i].slug === params.state.slug) {
                states_list.push({label : states[i].name, value : states[i].slug, selected : true});
            }
            else {
                states_list.push({label : states[i].name, value : states[i].slug});
            }
        }
        this.ui.list.filter.add(
            {type : 'select', name : 'state', label : 'Estado', options : states_list, change : function (value) {
                if (value !== 'undefined') selectCity(value);
            }}
        );
        selectCity();
    }
);

/**
 * Select box de cidades
 */
var selectCity = function (state) {
    var selectedState;
    if (state) selectedState = state;
    else if (params.state) {
        selectedState = params.state.slug;
    }
    if (!selectedState || selectedState === 'undefined') {
        app.ui.list.filter.add(
            {type : 'select', name : 'city', label : 'Cidade', options : [{label : 'escolha um estado'}]}
        );
    }
    else {
        app.ajax.getJSON(
            {
                url : 'http://' + app.config.services.location.host + ':' + app.config.services.location.port + '/country/brasil/state/' + selectedState + '/cities'
            },
            function (cities) {
                var cities_list = [];
                cities_list.push({label : 'escolha uma cidade'});
                for (var i in cities) {
                    if (params.city && cities[i].slug === params.city.slug) {
                        cities_list.push({label : cities[i].name, value : cities[i].slug, selected : true});
                    }
                    else {
                        cities_list.push({label : cities[i].name, value : cities[i].slug});
                    }
                }
                this.ui.list.filter.remove('form-city');
                this.ui.list.filter.add(
                    {type : 'select', name : 'city', label : 'Cidade', options : cities_list}
                );
            }
        );
    }
}


this.ui.list.filter.submit(function (data) {
    var url = '/';
    this.Utils().getParams(data, function(data) {
        if (data.state) {
            url += data.state.slug + '/';
            if (data.city) {
                url += data.city.slug + '/';
            }
            else {
                url += 'todas-as-cidades/';
            }
        }
        else {
            url += 'todos-os-estados/todas-as-cidades/';
        }
        if (data.sector) {
            url += data.sector.slug + '/';
        }
        app.route.path(url);

        app.Find(data);
    })
});