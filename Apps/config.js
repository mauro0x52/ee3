module.exports = {
    host : {
        port : 3303,
        url  : 'localhost',
        debuglevel : 1 // 0 sem erros, 1 com erros
    },
    mongodb : {
        port : 10034,
        url : 'staff.mongohq.com',
        username : 'empreendemia',
        password : 'kawasaki88',
        db : 'empreendemia'
    },
    services : {
        auth : {
            host : 'localhost',
            port : 3300
        },
        files : {
            host : 'localhost',
            port : 3301
        },
        companies : {
            host : 'localhost',
            port : 3302
        },
        apps : {
            host : 'localhost',
            port : 3303
        },
        profiles : {
            host : 'localhost',
            port : 3304
        },
        talk : {
            host : 'localhost',
            port : 3305
        },
        location : {
            host : 'localhost',
            port : 3306
        }
    },
    security : {
        token    : 'Digite qualquer hash aleatória',
        password : 'Digite qualquer hash aleatória'
    }
};
