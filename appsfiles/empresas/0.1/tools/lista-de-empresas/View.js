var companySlug = arguments[0];

new this.ajax.getJSON({
    url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/company/' + companySlug
}, function (company) {
    this.route.path('/empresa/'+company.slug);
    this.ui.frame.header.title(company.name);
    this.ui.frame.header.subtitle(company.activity);


    if (!company.thumbnail || !company.thumbnail.large || !company.thumbnail.large.url) {
        company.thumbnail = { large :
            {
                url : 'http://static2.worldofwonder.net/wp-content/uploads/2012/08/cdn.tvlia_.com_.files_.2010.05.alf2_.jpg',
                legend : 'imagem padrão'
            }
        }
    }

    this.ui.frame.header.thumbnail.src(company.thumbnail.large.url);
})