var company = arguments[0];

if (!company.thumbnail || !company.thumbnail.small || !company.thumbnail.small.url) {
    company.thumbnail = { small :
        {
            url : 'http://static2.worldofwonder.net/wp-content/uploads/2012/08/cdn.tvlia_.com_.files_.2010.05.alf2_.jpg',
            legend : 'imagem padrão'
        }
    }
}

var browseItem = new app.ui.browseOption({
    thumbnail : { src : company.thumbnail.small.url, alt : company.thumbnail.small.legend || 'whatever' },
    title : company.name,
    subtitle : company.activity,
    description : company.about,
    footer : '',
    click : function () {
        app.route.path('/empresa/'+company.slug);
        app.View(company.slug);
        app.ViewMain(company.slug);
    }
});
app.ui.list.browse.add(browseItem);

for (var i = 0; i < company.addresses.length; i++) {
    if (company.addresses[i].headQuarters) {
        app.Utils().getCityById(company.addresses[i].city, function(data) {
            browseItem.footer(data.city.name + ', ' + data.state.symbol);
        });
        break;
    }
}