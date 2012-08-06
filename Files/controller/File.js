/** Files
 * @author : Mauro Ribeiro
 * @since : 2012-07
 *
 * @description : Módulo que implementa as funcionalidades de arquivos em geral
 */
 
module.exports = function (app) {
    
    var Model = require('./../model/Model.js'),
        Image  = Model.Image,
        File = Model.File;

    var config  = require('../config.js'),
        express = require('express');

    /* Serve as imagens upadas */
    app.use('/uploads', express.static(config.files.folder));

};
