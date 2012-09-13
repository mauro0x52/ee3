var company = arguments[0], product = arguments[1];

app.Utils().getCompany(company, function(company) {
    var content = [], images = [], details = [], imageUrl;

    if (typeof(product) === 'string') {
        for (var i in company.products) {
            if (company.products[i].slug === product) {
                product = company.products[i];
            }
        }
    }

    app.ui.frame.content.remove();

    if (product.thumbnail && product.thumbnail.large && product.thumbnail.large.url) {
        imageUrl = product.thumbnail.large.url;
    } else {
        imageUrl = 'http://3.bp.blogspot.com/-4sIpOXr2XIE/UEK5K3qLAbI/AAAAAAAABUQ/c1MHzG9qkrQ/s320/PSY%2B-%2BGANGNAM%2BSTYLE.jpg';
    }

    images.push({a : { img : imageUrl, alt : 'imagem do produto', style : 'width-140' }, click : function() {}});

    for (var i in product.images) {
        images.push({a : { img : product.images[i].url, alt : product.images[i].title, style : ['width-60','margin-4'] }, click : function() {}});
    }

    content.push({div : images, style : 'width-160'});

    details.push({title : product.name});
    details.push({p : product.about});

    content.push({div : details, style : 'width-640'});

    app.ui.frame.content.add({content : content});
});