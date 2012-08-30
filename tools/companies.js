load : function () {

	this.ui.menu.navigation.add ({src : 'http://www.museu-goeldi.br/institucional/images/icone-endereco.gif',description:'Lista de Empresas',click:function () { this.ListCompanies (); }});
	
	
	this.ui.menu.navigation.add ({src : 'http://www.baraodemaua.br/institucional/imagens/icone_download.gif',description:'Populares',click:function () { this.ListCompanies (); }});
	
	this.ui.menu.navigation.add ({src : 'http://dicsin.com.br/css/images/icone_livro.jpg',description:'Favoritos',click:function () { this.ListCompanies (); }});
	
	this.ui.menu.navigation.add ({src : 'http://dicsin.com.br/css/images/icone_livro.jpg',description:'Visitados Recentemente',click:function () { this.ListCompanies (); }});

	
	this.ListCompanies ();
},

ListCompanies: function(){
	this.ajax.get({url : 'http://' + this.config.companies.host + ':' + this.config.companies.port + '/companies'}, function (data) {
		var companies, i;
		
		eval('companies = ' + data);
		
		this.ShowCompany(companies[0]);
		
		for(i in companies) {
			this.CompanyCB(companies[i]);
		}
		
	});
},

CompanyCB : function (company) {
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
		this.ShowCompany(company);
	};
	
	this.ui.list.browse.add(listCompanies);
},

ShowCompany : function (company) {
	var mainTab = [], productsTab = [], contactsTab = [], i;

	/* Declara titulo e subtitulo da página com nome da empresa */
	this.CompanySetTitle(company.name,company.activity);
	
	
	
	/* Pega 5 produtos principais para mostrar na aba Main */
	mainTab.push({title : 'Produtos em Destaque'});
	for (i in company.products) {
		/* Verifica se o Produto tem Thumbnail, se não adiciona uma imagem padrão. */
		/* Adiciona um HTML P com negrito informando o nome e imagem do produto. */
		if (company.products[i].thumbnail) {
			mainTab.push({p : {b : company.products[i].name, img : company.products[i].thumbnail.small.url}});
		} else {
			mainTab.push({p : {b : company.products[i].name, img : 'http://dicsin.com.br/css/images/icone_livro.jpg'}});
		};
	};
	
	/* Adiciona na Tab Main titulo e informações sobre a Empresa */
	mainTab.push({title : 'Sobre a Empresa'});
	mainTab.push({p : company.about});
	
	/* Remove todas as tabs, para não duplicar, e adiciona as informações novas. */
	this.ui.frame.tabs.remove();
	/* Cria a Aba Main no App  */
	this.ui.frame.tabs.add({id : 'mainTab'+company._id, src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Principal', value : mainTab});
	
	/* INICIA O CÓDIGO PARA ABA PRODUCTS */
	
	/* Pega todos os produtos da empresa e adiciona na aba Produtos */
	productsTab.push({title : 'Produtos'});
	productsTab.push({p : company.name});
	for (i in company.products) {
		/* Verifica se o Produto tem Thumbnail, se não adiciona uma imagem padrão. */
		/* Adiciona um HTML P com negrito informando o nome e imagem do produto. */
		if (company.products[i].thumbnail) {
			productsTab.push({p : {b : company.products[i].name, img : company.products[i].thumbnail.small.url}});
		} else {
			productsTab.push({p : {b : company.products[i].name, img : 'http://dicsin.com.br/css/images/icone_livro.jpg'}});
		};
	};
	
	/* Cria a Aba Products no App  */
	this.ui.frame.tabs.add({id : 'productTab', src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Produtos', value : productsTab});
	
	/* INICIA O CÓDIGO PARA ABA CONTATO */
	
	/* Pega todos os contatos da empresa e adiciona na aba Contato */
	contactsTab.push({title : 'Produtos'});
	for (i in company.contacts) {
		contactsTab.push({p : {b : company.contacts[i].type+": "+company.contacts[i].address}});
	};
	
	/* Cria a Aba Products no App  */
	this.ui.frame.tabs.add({id : 'productTab', src : 'http://dicsin.com.br/css/images/icone_livro.jpg', description : 'Produtos', value : productsTab});
},

CompanySetTitle : function(title, subtitle) {
	this.ui.frame.head.title(title);
	this.ui.frame.head.subtitle(subtitle);
}



/*,

ShowProduct : function (company, product) {
	
},

ShowContacts : function (company) {
	
}
*/