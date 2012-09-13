var company = arguments[0];

var printAddress = function(address) {
    var addressPrint = '';
    app.Utils().getCityById(address.city, function(data) {
        if (address.street) {
            addressPrint += address.street;
            if (address.number) {
                addressPrint += ', ' + address.number;
            }
            if (address.complement) {
                addressPrint += ', ' + address.complement;
            }
            addressPrint += ' - ';
        }
        addressPrint = data.city.name + ', ' + data.state.symbol;
        app.ui.frame.content.add({content : {p : addressPrint}});
    });
}

app.Utils().getCompany(company, function(company) {
    var content = [], links, contacts;

    app.ui.frame.content.remove();

    links = { website : [], blog : [], facebook : [], youtube : [], vimeo : [], slideshare : [] }
    contacts = { twitter : [], email : [], skype : [], gtalk : [], msn : [] }

    for (var i in company.links) {
        if (company.links[i].type === 'website') links.website.push(company.links[i].url);
        if (company.links[i].type === 'blog') links.blog.push(company.links[i].url);
        if (company.links[i].type === 'facebook') links.facebook.push(company.links[i].url);
        if (company.links[i].type === 'youtube') links.youtube.push(company.links[i].url);
        if (company.links[i].type === 'vimeo') links.vimeo.push(company.links[i].url);
        if (company.links[i].type === 'slideshare') links.slideshare.push(company.links[i].url);
    }

    for (var i in company.contact) {
        if (company.contact[i].type === 'twitter') contacts.twitter.push(company.contact[i].address);
        if (company.contact[i].type === 'email') contacts.email.push(company.contact[i].address);
        if (company.contact[i].type === 'skype') contacts.skype.push(company.contact[i].address);
        if (company.contact[i].type === 'gtalk') contacts.gtalk.push(company.contact[i].address);
        if (company.contact[i].type === 'msn') contacts.msn.push(company.contact[i].address);
    }

    content.push({title : 'Sites e links'});
    for (var i in links.website) content.push({p : links.website[i]});
    for (var i in links.blog) content.push({p : links.blog[i]});
    for (var i in links.facebook) content.push({p : links.facebook[i]});
    for (var i in links.youtube) content.push({p : links.youtube[i]});
    for (var i in links.vimeo) content.push({p : links.vimeo[i]});
    for (var i in links.slideshare) content.push({p : links.slideshare[i]});

    content.push({title : 'Emails para contato'});
    for (var i in contacts.email) content.push({p : contacts.email[i]});

    content.push({title : 'Outros contatos'});
    for (var i in contacts.twitter) content.push({p : contacts.twitter[i]});
    for (var i in contacts.skype) content.push({p : contacts.skype[i]});
    for (var i in contacts.gtalk) content.push({p : contacts.gtalk[i]});
    for (var i in contacts.msn) content.push({p : contacts.msn[i]});

    content.push({title : 'Endereços'});

    app.ui.frame.content.add({content : content});

    for (var i in company.addresses) {
        printAddress(company.addresses[i]);
    }

});