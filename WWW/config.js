module.exports = {
    host : {
        port : 38880,
        url  : 'localhost',
        debuglevel : 1 // 0 sem erros, 1 com erros
    },
    services : {
        auth : {
            host : 'localhost',
            port : 38800
        },
        files : {
            host : 'localhost',
            port : 38801
        },
        companies : {
            host : 'localhost',
            port : 38802
        },
        apps : {
            host : 'localhost',
            port : 38803
        },
        profiles : {
            host : 'localhost',
            port : 38804
        },
        talk : {
            host : 'localhost',
            port : 38805
        },
        location : {
            host : 'localhost',
            port : 38806
        }
    },
    security : {
        token    : 'Digite qualquer hash aleatória',
        password : 'Digite qualquer hash aleatória'
    }
};
