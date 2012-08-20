/*
 * peguei usando a query
 * SELECT concat("{ _id: ", id, " , slug: '",LOWER(slug),"' , name : '",  LOWER(name), "' },") FROM `sectors` order by id
 */

var Sector = {
    sectors : [
        { _id:  1 , slug: 'outro' , name : '~ outro' },
        { _id:  2 , slug: 'alimentos-e-bebidas' , name : 'alimentos e bebidas' },
        { _id:  3 , slug: 'arquitetura-e-construcao' , name : 'arquitetura e construção ' },
        { _id:  4 , slug: 'civil' , name : 'civil' },
        { _id:  5 , slug: 'assessoria-empresarial' , name : 'assessoria e consultoria empresarial' },
        { _id:  6 , slug: 'automobilistica-automotiva' , name : 'automobilística/automotiva' },
        { _id:  7 , slug: 'aviacao' , name : 'aviação' },
        { _id:  8 , slug: 'comercio-atacado-varejo' , name : 'comércio atacado/varejo' },
        { _id:  9 , slug: 'educacao-e-idiomas' , name : 'educação e idiomas' },
        { _id: 10 , slug: 'energia' , name : 'energia' },
        { _id: 11 , slug: 'entretenimento-cultura-e-lazer' , name : 'entretenimento, cultura e lazer' },
        { _id: 12 , slug: 'esportes' , name : 'esportes' },
        { _id: 13 , slug: 'financas-servicos-financeiros' , name : 'finanças - serviços financeiros' },
        { _id: 14 , slug: 'imoveis' , name : 'imóveis' },
        { _id: 15 , slug: 'industria' , name : 'indústria' },
        { _id: 16 , slug: 'jornalismo' , name : 'jornalismo' },
        { _id: 17 , slug: 'logistica' , name : 'logística' },
        { _id: 18 , slug: 'saude-e-medicina' , name : 'saúde e medicina' },
        { _id: 19 , slug: 'ti-e-informatica' , name : 'ti e informática' },
        { _id: 20 , slug: 'moda-e-vestuario' , name : 'moda e vestuário' },
        { _id: 21 , slug: 'turismo-e-hotelaria' , name : 'turismo e hotelaria' },
        { _id: 22 , slug: 'publicidade-e-propaganda' , name : 'publicidade e propaganda' },
        { _id: 23 , slug: 'agropecuaria' , name : 'agropecuária' },
        { _id: 24 , slug: 'terceiro-setor' , name : 'terceiro setor' },
        { _id: 25 , slug: 'design' , name : 'design' },
        { _id: 26 , slug: 'engenharia' , name : 'engenharia' },
        { _id: 27 , slug: 'jardinagem-paisagismo-floricultura' , name : 'jardinagem, paisagismo e floricultura' },
        { _id: 28 , slug: 'setor-publico' , name : 'setor público e captação de recursos' },
        { _id: 29 , slug: 'meio-ambiente-e-sustentabilidade' , name : 'meio-ambiente e sustentabilidade' },
        { _id: 30 , slug: 'importacao-exportacao' , name : 'importação/exportação' }
    ],
    find : function(params, cb) {
        cb(undefined, Sector.sectors);
    },
    findByIdentity : function (id, cb) {
        var i, sector;
        
        if (typeof(id) === 'number') {
            for (i = 0; i < Sector.sectors.length; i = i + 1) {
                if (Sector.sectors[i]._id === id) {
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
            cb('sector ' + id + ' not found');
        } else {
            cb(undefined, sector)
        }
    }
}

exports.Sector = Sector;
