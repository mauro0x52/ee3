var model = require('./model/Model.js'), country, state, city, region, countriesIds, citiesIds, statesIds, regionId;

var rand = function(type) {
    var crypto = require('crypto');
    var string;
    var hash = crypto.createHash('sha1').update(crypto.randomBytes(10)).digest('hex').substring(0, 5);

    if (type === 'email') {
        string = 'testes+' + hash + '@empreendemia.com.br';
    } else {
        string = hash;
    }
    return string;
}

//Populando Location

var region = new model.Region({
    name: 'Am'+rand()+'a',
    countryIds:[],
    stateIds:[],
    cityIds:[]
})

region.save(function(error){
    if (error) {
        console.log(error);
    } else {
        regionId : region._id;
    }
})

for(i=0;i<15;i++){
    //Gera Country
    var country = new model.Country({
        name: 'Pais'+rand(),
        acronym: 'U'+rand()+'A',
        ddi: '123',
        regionIds: regionId
    });
    //Salva Country
    country.save(function(error){
        if (error) {
            console.log(error)
        } else {
            console.log(country._id);
            countriesIds[i] = country._id;
            for(n=0;n<20;n++){
                //Cria states
                var state = new model.State({
                    name:'M'+rand()+'s',
                    countryId:country._id,
                    regionIds: regionId
                });
                //Salva State
                state.save(function(error){
                    if (error) {
                        console.log(error);
                    } else {
                        statesIds[''+n+''] = state._id;
                        for(b=0;b<20;b++){
                            //Cria cities
                            var city = new model.City({
                                name:'Be '+rand()+' te',
                                ddd:'123',
                                stateId : state._id,
                                regionIds: regionId
                            })
                            //Salva Cities
                            city.save(function(error){
                                if (error) {
                                    console.log(error);
                                } else {
                                    citiesIds[b] = city._id;
                                }
                            });
                        }
                    }
                });
            }
        }
    })
}