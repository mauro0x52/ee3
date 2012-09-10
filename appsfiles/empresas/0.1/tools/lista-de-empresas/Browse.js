var company = arguments[0];

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
