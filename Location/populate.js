var model = require('./model/Model.js');


//Countries
var brasil = new model.Country({_id: '50118bc9bb469bc90c000001', name: 'Brasil', acronym: 'BR', slug:"brasil", ddi: 55, regionIds:["50118c17f21a5fce0c000003"]});
var usa = new model.Country({_id: '50118bc9bb469bc90c000002', name: 'United States', acronym: 'USA', slug: "united states", ddi: 1, regionIds:["50118c17f21a5fce0c000003"]});


//Region
var america = new model.Region({_id: '50118c17f21a5fce0c000003',name: 'America', slug: 'america',
                        countryIds:[
                            '50118bc9bb469bc90c000001'
                        ],
                        stateIds:[
                            "501190446b48b7530d000005",
                            "501190446b48b7530d000006"
                        ],
                        cityIds:[
                            "50119a84e5385bfc0d00000c",
                            "50119a84e5385bfc0d000009"
                        ]});
                        
var africa = new model.Region({_id: '50118c17f21a5fce0c000004',name: 'Africa', slug: 'africa',
                        countryIds:[
                            '50118bc9bb469bc90c000002'
                        ],
                        stateIds:[
                            "501190446b48b7530d000007",
                            "501190446b48b7530d000008"
                        ],
                        cityIds:[
                            "50119a84e5385bfc0d00000e",
                            "50119a84e5385bfc0d00000f"
                        ]})


//States
var mg = new model.State({_id:'501190446b48b7530d000005',name:'Minas Gerais',slug:'minas_gerais',countryId:'50118bc9bb469bc90c000001', regionIds:["50118c17f21a5fce0c000003"]});
var sp = new model.State({_id:'501190446b48b7530d000006',name:'São Paulo',slug:'sao_paulo',countryId:'50118bc9bb469bc90c000001', regionIds:["50118c17f21a5fce0c000003"]});
var alabama = new model.State({_id:'501190446b48b7530d000007',name:'Alabama',slug:'alabama',countryId:'50118bc9bb469bc90c000002'});
var newyork = new model.State({_id:'501190446b48b7530d000008',name:'New York',slug:'new_york',countryId:'50118bc9bb469bc90c000002'});


//Cities
var bh = new model.City({_id:"50119a84e5385bfc0d00000c",name:'Belo Horizonte', slug:"belo_horizonte",ddd:'31', stateId:'501190446b48b7530d000005', regionIds:["50118c17f21a5fce0c000003"]});
var contagem = new model.City({_id:"50119a84e5385bfc0d000009",name:'Contagem', slug:"contagem", ddd:'31', stateId:'501190446b48b7530d000005', regionIds:["50118c17f21a5fce0c000003"]});
var campinas = new model.City({_id:"50119a84e5385bfc0d00000a",name:'Campinas', slug:"campinas", ddd:'19', stateId:'501190446b48b7530d000006'});
var sp = new model.City({_id:"50119a84e5385bfc0d00000b",name:'São Paulo', slug:"sao_paulo", ddd:'11', stateId:'501190446b48b7530d000006'});
var montgomery = new model.City({_id:"50119a84e5385bfc0d00000d",name:'Montgomery', slug:"montgomery", ddd:'00', stateId:'501190446b48b7530d000007'});
var loxley = new model.City({_id:"50119a84e5385bfc0d00000e",name:'Loxley', slug:"loxley", ddd:'00', stateId:'501190446b48b7530d000007'});
var albany = new model.City({_id:"50119a84e5385bfc0d00000f",name:'Albany', slug:"albany", ddd:'00', stateId:'501190446b48b7530d000008'});
var buffalo = new model.City({_id:"50119a84e5385bfc0d000010",name:'Buffalo', slug:"buffalo", ddd:'00', stateId:'501190446b48b7530d000008'});


brasil.save()
usa.save()

america.save()
africa.save()

mg.save();
sp.save();
alabama.save();
newyork.save();

bh.save();
contagem.save();
campinas.save();
sp.save();
montgomery.save();
loxley.save();
albany.save();
buffalo.save();