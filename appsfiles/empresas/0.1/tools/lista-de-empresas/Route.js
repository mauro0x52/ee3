this.route.fit('/', function (params, query) {
    this.Filter(params, query);
    this.Find(params);
});

this.route.fit('/:state', function (params, query) {
    this.Filter(params, query);
    this.Browse(params);
});

this.route.fit('/:state/:city', function (params, query) {
    this.Filter(params, query);
    this.Find(params);
});

this.route.fit('/:state/:city/:sector', function (params, query) {
    this.Filter(params, query);
    this.Find(params);
});

this.route.fit('/:state/:city/:sector/:company_slug', function (params, query) {
    this.Filter(params, query);
    this.Find(params);
    this.View(params.company_slug);
});