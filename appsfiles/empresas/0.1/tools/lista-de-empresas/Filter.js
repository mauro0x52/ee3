this.ui.list.filter.remove();
/*this.ui.list.filter.add([
    {type : 'text', name : 'teste', label : 'Nome do bagulho', value : 'testando'},
    {type : 'select', name : 'select', label : 'Select mano', optgroups : [
        {label : 'grupo 1', options : [
            { label : 'opção 1', value : 1 },
            { label : 'opção 2', value : 2 },
            { label : 'opção 3', value : 3 }
        ]}
    ]},
    {type : 'radio', name : 'radio', label : 'Radio mano', radios : [
        { label : 'opção 1', value : 1 },
        { label : 'opção 2', value : 2 },
        { label : 'opção 3', value : 3 }
    ]},
    {type : 'checkbox', label : 'Checkbox mano', checkboxes : [
        { name : 'checkbox1', label : 'opção 1', value : 1 },
        { name : 'checkbox2', label : 'opção 2', value : 2 },
        { name : 'checkbox3', label : 'opção 3', value : 3 }
    ]}
]);

    {type : 'select', name : 'select', label : 'Select mano', options : [
        { label : 'escolha uma opcao' },
        { label : 'opção 1', value : 1 },
        { label : 'opção 2', value : 2 },
        { label : 'opção 3', value : 3 },
        { label : 'grupo A', options : [
            { label : 'opção A1', value : 1 },
            { label : 'opção A2', value : 2 },
            { label : 'opção A3', value : 3 }
        ]},
        { label : 'grupo B', options : [
            { label : 'opção B1', value : 1 },
            { label : 'opção B2', value : 2 },
            { label : 'opção B3', value : 3 },
            { label : 'grupo BX', options : [
                { label : 'opção BX1', value : 1 },
                { label : 'opção BX2', value : 2 },
                { label : 'opção BX3', value : 3 }
            ]}
        ]}
    ]},

 */

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
            sectors_list.push({label : sectors[i].name, value : sectors[i]._id});
        }
        this.ui.list.filter.add(
            {type : 'select', name : 'sectors', label : 'Setor', options : sectors_list}
        );
    }
);


/**
 * Select box de cidades
 */
this.ajax.getJSON(
    {
        url : 'http://' + this.config.services.location.host + ':' + this.config.services.location.port + '/country/brasil/state/sao-paulo/cities'
    },
    function (cities) {
        var cities_list = [];
        cities_list.push({label : 'escolha uma cidade'});
        for (var i in cities) {
            cities_list.push({label : cities[i].name, value : cities[i]._id});
        }
        this.ui.list.filter.add(
            {type : 'select', name : 'cities', label : 'Cidade', options : cities_list}
        );
    }
);

this.ui.list.filter.submit(function (data) {
    this.ajax.getJSON({
        url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/companies',
        data : {
            limit : 20,
            page : 1,
            sectors : data.sectors,
            cities : data.cities
        }},
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

                this.ui.list.browse.add({
                    thumbnail : { src : company.thumbnail.small.url, alt : company.thumbnail.small.legend || 'whatever' },
                    title : company.name,
                    subtitle : company.activity,
                    description : company.about,
                    footer : 'nada',
                    click : function () {

                    }
                })
            }
        }
    );
    return false;
});

this.ajax.getJSON({
    url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/companies',
    data : {limit : 20, page : 1}},
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

            this.ui.list.browse.add({
                thumbnail : { src : company.thumbnail.small.url, alt : company.thumbnail.small.legend || 'whatever' },
                title : company.name,
                subtitle : company.activity,
                description : company.about,
                footer : 'nada',
                click : function () {

                }
            })
        }
    }
);
