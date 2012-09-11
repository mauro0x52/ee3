var app = this;

var getSector = function (slug, cb) {
    app.ajax.getJSON(
        {
            url : 'http://' + app.config.services.companies.host + ':' + app.config.services.companies.port + '/sector/' + slug
        },
        function (sector) {
            cb(sector);
        }
    );
}

this.route.fit('/', function (params, query) {
    app.Filter(params, query);
    app.Find(params);
});

this.route.fit('/:state', function (params, query) {
    this.Utils().getParams(params, function(data) {
        app.Filter(params, query);
        app.Find(params);
    });
});

this.route.fit('/:state/:city', function (params, query) {
    if (params.state !== 'empresa') {
        this.Utils().getParams(params, function(data) {
            app.Filter(data, query);
            app.Find(data);
        });
    }
});

this.route.fit('/:state/:city/:sector', function (params, query) {
    this.Utils().getParams(params, function(data) {
        app.Filter(data, query);
        app.Find(data);
    });
});

this.route.fit('/empresa/:company_slug', function (params, query) {
//    this.Utils().getParams(params, function(data) {
//        app.Filter(data, query);
//        app.Find(data);
        app.View(params.company_slug);
//    })
});
