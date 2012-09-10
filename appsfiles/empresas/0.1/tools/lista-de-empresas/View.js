var companySlug = arguments[0];

new this.ajax.getJSON({
    url : 'http://' + this.config.services.companies.host + ':' + this.config.services.companies.port + '/company/' + companySlug
}, function (company) {
    this.route.path('/empresa/'+company.slug);
    this.ui.frame.header.title(company.name);
    this.ui.frame.header.subtitle(company.activity);
    this.ui.frame.header.thumbnail.src(company.thumbnail.large.url);
})