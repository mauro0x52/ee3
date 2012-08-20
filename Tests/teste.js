/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



var should = require("should"),
    api = require("./Utils.js").api,
    db = require("./Utils.js").db,
    rand = require("./Utils.js").rand;

function foo(cb) {
    console.log('"2"+"2"="22"');
    var data = {
        vara : 'vara',
        varb : 'varb',
        varc : 'varc'
    }
    cb(data);
}


describe('teste', function() {
   it('testando', function(done) {
       console.log('testandooaeeee');
       foo(function(data) {
            "oi".should.equal("oi");
            should.not.exist(data.vard);
            should.exist(data.vara);
            should.exist(data.varx);
            done();
       });
   })
});