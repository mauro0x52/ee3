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
            if (sectors[i]._id === params.sector) {
                sectors_list.push({label : sectors[i].name, value : sectors[i]._id, selected : true});
            }
            else {
                sectors_list.push({label : sectors[i].name, value : sectors[i]._id});
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
            if (states[i]._id === params.state) {
                states_list.push({label : states[i].name, value : states[i]._id, selected : true});
            }
            else {
                states_list.push({label : states[i].name, value : states[i]._id});
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
    var selectedState = state ? state : params.state;
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
                    if (cities[i]._id === params.city) {
                        cities_list.push({label : cities[i].name, value : cities[i]._id, selected : true});
                    }
                    else {
                        cities_list.push({label : cities[i].name, value : cities[i]._id});
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
    if (data.state && data.state !== 'undefined') {
        url += data.state + '/';
        if (data.city && data.city !== 'undefined') {
            url += data.city + '/';
        }
        else {
            url += 'todas-as-cidades/';
        }
    }
    else {
        url += 'todos-os-estados/todas-as-cidades/';
    }
    if (data.sector && data.sector !== 'undefined') {
        url += data.sector + '/';
    }
    this.route.path(url);

    this.Find(data);
});