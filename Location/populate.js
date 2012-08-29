var model = require('./model/Model.js'), country, state, city, region, region2, regionx, regiony, regionId, rg;
var countriesIds = [], countriesIds2 = [], statesIds = [], statesIds2 = [], citiesIds = [], citiesIds2 = [], regionsIds = [];

var rand = function(type) {
    var crypto = require('crypto');
    var string;
    var hash = crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 5);
    return hash;
}

//Populando Location
region = new model.Region({
    name: 'Am'+rand()+'a',
    countryIds:[],
    stateIds:[],
    cityIds:[]
})

region.save(function(error){
    if (error) {
        console.log(error);
    } else {
        regionId = region._id;
        regionsIds.push(region._id);
    }
})
region2 = new model.Region({
    name: 'Am'+rand()+'a',
    countryIds:[],
    stateIds:[],
    cityIds:[]
})

region2.save(function(error){
    if (error) {
        console.log(error);
    } else {
        regionId = region._id;
        regionsIds.push(region._id);
    }
})

rg = "1";

for(i=0;i<=15;i++){
    if (rg == "1"){
        rg = "2";
    } else {
        rg = "1";
    }
    //Gera Country
    country = new model.Country({
        name: 'Pais'+rand(),
        acronym: 'U'+rand()+'A',
        ddi: '123',
        regionIds: regionsIds[rg]
    });
    //Salva Country
    country.save(function(error){
        if (error) {
            console.log(error)
        } else {
            if (rg == "1") {
                countriesIds.push(country._id);
            } else {
                countriesIds2.push(country._id);
            }
            
            for(n=0;n<20;n++){
                //Cria states
                state = new model.State({
                    name:'M'+rand()+'s',
                    countryId:country._id,
                    regionIds: regionsIds[rg]
                });
                //Salva State
                state.save(function(error){
                    if (error) {
                        console.log(error);
                    } else {
                        if (rg == "1") {
                            statesIds.push(state._id);
                        } else {
                            statesIds2.push(state._id);
                        }
                        for(b=0;b<20;b++){
                            //Cria cities
                            city = new model.City({
                                name:'Be '+rand()+' te',
                                ddd:'123',
                                stateId : state._id,
                                regionIds: regionsIds[rg]
                            })
                            //Salva Cities
                            city.save(function(error){
                                if (error) {
                                    console.log(error);
                                } else {
                                    if (rg == "1") {
                                        citiesIds.push(state._id);
                                    } else {
                                        citiesIds2.push(state._id);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    })
}


model.Region.findById(region._id,function(error, regionx){
    if (error) {
        console.log(error);
    } else {
        regionx.countryIds = countriesIds;
        regionx.stateIds = statesIds;
        regionx.cityIds = citiesIds;
        
        regionx.save(function(error){
            if (error) {
                console.log(error);
            }
        });
    }
});

model.Region.findById(region2._id,function(error, regiony){
    if (error) {
        console.log(error);
    } else {
        regiony.countryIds = countriesIds2;
        regiony.stateIds = statesIds2;
        regiony.cityIds = citiesIds2;
        
        regiony.save(function(error){
            if (error) {
                console.log(error);
            }
        });
    }
});