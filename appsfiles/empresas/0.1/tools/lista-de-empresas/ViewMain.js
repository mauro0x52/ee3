var company = arguments[0];

var showProduct = function (company, product) {
    var content = [], imageUrl;
    if (product.thumbnail && product.thumbnail.large && product.thumbnail.large.url) {
        imageUrl = product.thumbnail.large.url;
    } else {
        imageUrl = 'http://3.bp.blogspot.com/-4sIpOXr2XIE/UEK5K3qLAbI/AAAAAAAABUQ/c1MHzG9qkrQ/s320/PSY%2B-%2BGANGNAM%2BSTYLE.jpg';
    }
    content.push({
        a : {
            img : imageUrl,
            alt : product.name,
            style : ['width-140', 'margin-10']
        },
        click : function () {
            this.route.path('/empresa/'+company.slug+'/produto/'+product.slug);
            this.ViewProduct(company, product);
        }
    });
    return content;
}

app.Utils().getCompany(company, function(company) {
    var content = [], products = [], about;
    app.ui.frame.content.remove();

    content.push({title : 'Produtos em Destaque'});

    for (var i = 0; i < 5 ; i++) {
        if (company.products[i]) products.push(showProduct(company, company.products[i]));
    }

    content.push({div : products});

    content.push({title : 'Sobre a Empresa'});

    about = company.about.split('\n');
    for (var i in about) {
        content.push({p : about[i]});
    }

    app.ui.frame.content.add({content : content});
});
