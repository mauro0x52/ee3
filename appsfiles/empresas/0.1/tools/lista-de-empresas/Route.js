var route = this.route.path();

console.log(route);

if (!route || !route[0] || route[0] === 'buscar') {
    this.Filter();
}