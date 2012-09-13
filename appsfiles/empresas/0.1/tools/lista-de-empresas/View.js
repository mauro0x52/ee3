var company = arguments[0];

app.Utils().getCompany(company, function(company) {
    app.ui.frame.header.title(company.name);
    app.ui.frame.header.subtitle(company.activity);

    if (!company.thumbnail || !company.thumbnail.large || !company.thumbnail.large.url) {
        company.thumbnail = { large :
            {
                url : 'http://static2.worldofwonder.net/wp-content/uploads/2012/08/cdn.tvlia_.com_.files_.2010.05.alf2_.jpg',
                legend : 'imagem padrão'
            }
        }
    }

    app.ui.frame.header.thumbnail.src(company.thumbnail.large.url);

    app.ui.frame.tabs.remove();

    app.ui.frame.tabs.add({ description : 'principal', click : function() {
        this.route.path('/empresa/'+company.slug);
        app.ViewMain(company);
    } });
    app.ui.frame.tabs.add({ description : 'produtos', click : function() {
        this.route.path('/empresa/'+company.slug+'/produtos/');
        app.ViewProducts(company);
    } });
    app.ui.frame.tabs.add({ description : 'contatos', click : function() {
        this.route.path('/empresa/'+company.slug+'/contatos/');
        app.ViewContacts(company);
    } });
});