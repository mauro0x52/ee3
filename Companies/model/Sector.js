/*
 * peguei usando a query
 * SELECT concat("{ _id: ", id, " , slug: '",LOWER(slug),"' , name : '",  LOWER(name), "' },") FROM `sectors` order by id
 */

var ObjectId = require('mongoose').Types.ObjectId;

var Sector = {
    sectors : [
        { _id: new ObjectId("000000000000000000000001") , slug: 'outro' ,                               name : '~ outro' },
        { _id: new ObjectId("000000000000000000000002") , slug: 'alimentos-e-bebidas' ,                 name : 'alimentos e bebidas' },
        { _id: new ObjectId("000000000000000000000003") , slug: 'arquitetura-e-construcao' ,            name : 'arquitetura e construção ' },
        { _id: new ObjectId("000000000000000000000004") , slug: 'civil' ,                               name : 'civil' },
        { _id: new ObjectId("000000000000000000000005") , slug: 'assessoria-empresarial' ,              name : 'assessoria e consultoria empresarial' },
        { _id: new ObjectId("000000000000000000000006") , slug: 'automobilistica-automotiva' ,          name : 'automobilística/automotiva' },
        { _id: new ObjectId("000000000000000000000007") , slug: 'aviacao' ,                             name : 'aviação' },
        { _id: new ObjectId("000000000000000000000008") , slug: 'comercio-atacado-varejo' ,             name : 'comércio atacado/varejo' },
        { _id: new ObjectId("000000000000000000000009") , slug: 'educacao-e-idiomas' ,                  name : 'educação e idiomas' },
        { _id: new ObjectId("000000000000000000000010") , slug: 'energia' ,                             name : 'energia' },
        { _id: new ObjectId("000000000000000000000011") , slug: 'entretenimento-cultura-e-lazer' ,      name : 'entretenimento, cultura e lazer' },
        { _id: new ObjectId("000000000000000000000012") , slug: 'esportes' ,                            name : 'esportes' },
        { _id: new ObjectId("000000000000000000000013") , slug: 'financas-servicos-financeiros' ,       name : 'finanças - serviços financeiros' },
        { _id: new ObjectId("000000000000000000000014") , slug: 'imoveis' ,                             name : 'imóveis' },
        { _id: new ObjectId("000000000000000000000015") , slug: 'industria' ,                           name : 'indústria' },
        { _id: new ObjectId("000000000000000000000016") , slug: 'jornalismo' ,                          name : 'jornalismo' },
        { _id: new ObjectId("000000000000000000000017") , slug: 'logistica' ,                           name : 'logística' },
        { _id: new ObjectId("000000000000000000000018") , slug: 'saude-e-medicina' ,                    name : 'saúde e medicina' },
        { _id: new ObjectId("000000000000000000000019") , slug: 'ti-e-informatica' ,                    name : 'ti e informática' },
        { _id: new ObjectId("000000000000000000000020") , slug: 'moda-e-vestuario' ,                    name : 'moda e vestuário' },
        { _id: new ObjectId("000000000000000000000021") , slug: 'turismo-e-hotelaria' ,                 name : 'turismo e hotelaria' },
        { _id: new ObjectId("000000000000000000000022") , slug: 'publicidade-e-propaganda' ,            name : 'publicidade e propaganda' },
        { _id: new ObjectId("000000000000000000000023") , slug: 'agropecuaria' ,                        name : 'agropecuária' },
        { _id: new ObjectId("000000000000000000000024") , slug: 'terceiro-setor' ,                      name : 'terceiro setor' },
        { _id: new ObjectId("000000000000000000000025") , slug: 'design' ,                              name : 'design' },
        { _id: new ObjectId("000000000000000000000026") , slug: 'engenharia' ,                          name : 'engenharia' },
        { _id: new ObjectId("000000000000000000000027") , slug: 'jardinagem-paisagismo-floricultura' ,  name : 'jardinagem, paisagismo e floricultura' },
        { _id: new ObjectId("000000000000000000000028") , slug: 'setor-publico' ,                       name : 'setor público e captação de recursos' },
        { _id: new ObjectId("000000000000000000000029") , slug: 'meio-ambiente-e-sustentabilidade' ,    name : 'meio-ambiente e sustentabilidade' },
        { _id: new ObjectId("000000000000000000000030") , slug: 'importacao-exportacao' ,               name : 'importação/exportação' }
    ],
    find : function(params, cb) {
        cb(undefined, Sector.sectors);
    },
    findByIdentity : function (id, cb) {
        var i, sector;

        if (typeof(id) === 'number') {
            for (i = 0; i < Sector.sectors.length; i = i + 1) {
                if (Sector.sectors[i]._id.toString() === id) {
                    sector = Sector.sectors[i];
                }
            }
        } else {
            for (i = 0; i < Sector.sectors.length; i = i + 1) {
                if (Sector.sectors[i].slug === id) {
                    sector = Sector.sectors[i];
                }
            }
        }

        if (!sector) {
            cb({message :  'sector not found', name : 'NotFoundError', id : id, path : 'sector'});
        } else {
            cb(undefined, sector)
        }
    }
}

exports.Sector = Sector;
