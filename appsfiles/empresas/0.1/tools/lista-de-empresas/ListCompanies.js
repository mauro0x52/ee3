this.ajax.get({url : 'http://' + this.config.companies.host + ':' + this.config.companies.port + '/companies', data : {limit : 20, page : 1}}, function (data) {
    var companies, i;

    eval('companies = ' + data);

    /* Carrega uma empresa na tela */
    this.ShowCompany(companies[0]);

    for(i in companies) {
        this.ShowCompany(companies[i]);
    }
});