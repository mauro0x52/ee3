module.exports = {
    host : {
        port : 38880,
        url  : '192.168.0.98',
        debuglevel : 1 // 0 sem erros, 1 com erros
    },
    services : {
        auth : {
            host : '192.168.0.98',
            port : 38800
        },
        files : {
            host : '192.168.0.98',
            port : 38801
        },
        companies : {
            host : '192.168.0.98',
            port : 38802
        },
        apps : {
            host : '192.168.0.98',
            port : 38803
        },
        profiles : {
            host : '192.168.0.98',
            port : 38804
        },
        talk : {
            host : '192.168.0.98',
            port : 38805
        },
        location : {
            host : '192.168.0.98',
            port : 38806
        }
    },
    security : {
        token    : 'Digite qualquer hash aleatória',
        password : 'Digite qualquer hash aleatória'
    }
};
