this.ui.list.filter.remove();
this.ui.list.filter.add([
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

//this.ui.list.filter.submit(function (data) {
//    this.Browse(data);
//});

this.ajax.getJSON({
    url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/companies',
    data : {limit : 20, page : 1}},
    function (companies) {
        for (var i in companies) {
            var company = companies[i];
            for (var prop in company) {
                console.log(prop + ' : ' + company[prop]);
            }
            this.ui.list.browse.add({
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
