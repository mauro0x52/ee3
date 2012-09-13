var company = arguments[0];

var listProducts = function(company, product) {
    var content = [], imageUrl;

    if (product.thumbnail && product.thumbnail.large && product.thumbnail.large.url) {
        imageUrl = product.thumbnail.large.url;
    } else {
        imageUrl = 'http://3.bp.blogspot.com/-4sIpOXr2XIE/UEK5K3qLAbI/AAAAAAAABUQ/c1MHzG9qkrQ/s320/PSY%2B-%2BGANGNAM%2BSTYLE.jpg';
    }
    content.push({
        div : [
            {
                div : {
                    a : {
                        img : imageUrl,
                        alt : product.name,
                        style : 'width-100'
                    },
                    click : function () {
                        app.route.path('/empresa/'+company.slug+'/produto/'+product.slug);
                        app.ViewProduct(company, product);
                    }
                },
                style : 'width-120'
            },
            {
                div : [
                    //{ subtitle : product.name },

                    {
                        subtitle : {
                            a : product.name,
                            click : function () {
                                app.route.path('/empresa/'+company.slug+'/produto/'+product.slug);
                                app.ViewProduct(company, product);
                            }
                        }
                    },
                    { p : product.abstract }
                ],
                style : 'width-640'
            }
        ],
        style : 'margin-10'
    });

    return content;
}

app.Utils().getCompany(company, function(company) {
    var content = [];

    app.ui.frame.content.remove();

    for (var i in company.products) {
        content.push(listProducts(company, company.products[i]));
    }

    app.ui.frame.content.add({content : content});
});