var company = arguments[0];

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
        this.View(company.slug);
    }
})
