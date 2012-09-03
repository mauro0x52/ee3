load : function () {

    this.ui.menu.navigation.add ({src : 'http://www.museu-goeldi.br/institucional/images/icone-endereco.gif', description : 'Lista de Empresas', click : function () { this.ListCompanies(); }});

    this.ui.menu.navigation.add ({src : 'http://www.baraodemaua.br/institucional/imagens/icone_download.gif', description : 'Populares', click : function () { this.ListCompanies(); }});

    this.ui.menu.navigation.add ({src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Favoritos', click : function () { this.ListCompanies(); }});

    this.ui.menu.navigation.add ({src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Visitados Recentemente', click : function () { this.ListCompanies (); }});

    this.ListCompanies ();
},

ListCompanies: function(){
    this.ajax.get({url : 'http://' + this.config.companies.host + ':' + this.config.companies.port + '/companies', data : {limit : 20, page : 1}}, function (data) {
        var companies, i;

        eval('companies = ' + data);
        
        /* Carrega uma empresa na tela */
        this.ShowCompany(companies[0]);
        
        for(i in companies) {
            this.ShowCompany(companies[i]);
        }
    });
}
,

ShowCompany : function (company) {
    var listCompanies = {};

    listCompanies.id = company._id;
    if (company.thumbnail) {
        listCompanies.src = company.thumbnail.small.url;
    } else {
        listCompanies.src = 'http://www.baraodemaua.br/institucional/imagens/icone_download.gif';
    }
    listCompanies.description = company.about;
    listCompanies.title = company.name;
    listCompanies.click = function () {
        /* Declara titulo e subtitulo da página com nome da empresa */
        this.ui.frame.head.title(company.name);
        this.ui.frame.head.subtitle(company.activity);

        /* Remove todas as tabs, para não duplicar */
        this.ui.frame.tabs.remove();

        /* Monta a aba principal */
        this.MainTab(company);

        /* Monta a aba produtos */
        this.ProductsTab(company);

        /* Monta a aba contato */
        this.ContactTab(company);
    };

    this.ui.list.browse.add(listCompanies);
},

MainTab : function (company) {
    var tab = [],
        i;

    /* Pega 5 produtos principais para mostrar na aba Main */
    tab.push({title : 'Produtos em Destaque'});
    for (i in company.products) {
        /* Verifica se o Produto tem Thumbnail, se não adiciona uma imagem padrão. */
        /* Adiciona um HTML P com negrito informando o nome e imagem do produto. */
        if (company.products[i].thumbnail) {
            tab.push({p : {b : company.products[i].name, img : company.products[i].thumbnail.small.url}});
        } else {
            tab.push({p : {b : company.products[i].name, img : 'http://dicsin.com.br/css/images/icone_livro.jpg'}});
        };
    };

    /* Adiciona na Tab Main titulo e informações sobre a Empresa */
    tab.push({title : 'Sobre a Empresa'});
    tab.push({p : company.about});

    /* adiciona a aba */
    this.ui.frame.tabs.add({id : 'mainTab'+company._id, src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Principal', value : tab});
},

ProductsTab : function (company) {
    var tab = [],
        i;

    /* Pega todos os produtos da empresa e adiciona na aba Produtos */
    tab.push({title : 'Produtos'});
    for (i in company.products) {
        /* Verifica se o Produto tem Thumbnail, se não adiciona uma imagem padrão. */
        /* Adiciona um HTML P com negrito informando o nome e imagem do produto. */
        tab.push({p : {a : company.products[i].name, url : company.slug + '/produto/' + company.products[i].slug, click : function(data){
		
			console.log('ok');
			
			
		}}});
    };

    /* adiciona a aba */
    this.ui.frame.tabs.add({id : 'productTab', src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Produtos', value : tab});
},

ShowProduct : function (company, product) {
	
},

ContactTab : function (company) {
	var tab = [], i, address;
	
	tab.push({title : 'Contato'});
	
	/* Pega todos os contatos da empresa e adiciona na aba Contato */
    for (i in company.contacts) {
        tab.push({p : {b : company.contacts[i].type+' : '+company.contacts[i].address}});
    };
	
	/* Pega todos os Endereços da empresa e adiciona na aba Contato */
	for (i in company.addresses) {
		this.ajax.get({url : 'http://' + this.config.location.host + ':' + this.config.location.port + '/city/' + company.addresses[i].city}, function (data) {
			var city;
		    
		    /* Adiciona a variavel data na variável city */
	        eval('city = ' + data);
		    
	        tab.push({p : {b : company.addresses[i].street + ', ' + company.addresses[i].number + ' ' + company.addresses[i].complement + ' - ' + city.name + ', ' + city.state}});
        });
	}
	
	/* adiciona a aba */
    this.ui.frame.tabs.add({id : 'productTab', src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Contatos', value : tab});
}