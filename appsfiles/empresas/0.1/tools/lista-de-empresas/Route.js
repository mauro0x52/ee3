app.route.fit('/', function (params, query) {
    app.Filter(params, query);
    app.Find(params);
});

app.route.fit('/estado/:state', function (params, query) {
    app.Utils().getParams(params, function(data) {
        app.Filter(params, query);
        app.Find(params);
    });
});

app.route.fit('/estado/:state/cidade/:city', function (params, query) {
    app.Utils().getParams(params, function(data) {
        app.Filter(data, query);
        app.Find(data);
    });
});

app.route.fit('/estado/:state/cidade/:city/setor/:sector', function (params, query) {
    app.Utils().getParams(params, function(data) {
        app.Filter(data, query);
        app.Find(data);
    });
});

app.route.fit('/setor/:sector', function (params, query) {
    app.Utils().getParams(params, function(data) {
        app.Filter(data, query);
        app.Find(data);
    });
});

app.route.fit('/estado/:state/setor/:sector', function (params, query) {
    app.Utils().getParams(params, function(data) {
        app.Filter(data, query);
        app.Find(data);
    });
});

app.route.fit('/empresa/:company_slug', function (params, query) {
    app.Utils().getCompany(params.company_slug, function (company) {
        app.View(company);
        app.ViewMain(company);
    })
});

app.route.fit('/empresa/:company_slug/produtos', function (params, query) {
    app.Utils().getCompany(params.company_slug, function (company) {
        app.View(company);
        app.ViewProducts(company);
    })
});

app.route.fit('/empresa/:company_slug/produto/:product_slug', function (params, query) {
    app.Utils().getCompany(params.company_slug, function (company) {
        app.View(company);
        app.ViewProduct(company, params.product_slug);
    })
});

app.route.fit('/empresa/:company_slug/contatos', function (params, query) {
    app.Utils().getCompany(params.company_slug, function (company) {
        app.View(company);
        app.ViewContacts(company);
    })
});
