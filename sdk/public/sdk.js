String.prototype.clear = function()
{
    return this.replace(/<\/?[^>]+(>|$)/g, "");
};

var console = {};
console.log = function(data){document.getElementById('console').innerHTML = document.getElementById('console').innerHTML + data + '<br />';}
console.error = function(data){console.log('<font color="red">' + data + '</font>');}
console.spacer = function(){console.log('<font color="green">-------------------------------------------------------------------------------------------------------------</font>')};

var eeSDK = {
    apps : [],

    loadModule : function(name, cb)
    {
        var script  = document.createElement('script');
	script.src  = name;
	script.type = 'text/javascript';
	script.onload  = cb;
	script.onerror = function(){
	    console.log('Ocorreu um erro ao carregar o modulo');
	}

	document.body.appendChild(script);
    },
 
    loadCode : function(appName)
    {
        new this.ajax.call({
	    url : appName + '/load',
	    success : function(data){
	        this.appBuilder(data);
	    },
	    error: function(){
	        console.error('Problema para carregar o aplicativo');
	    }
	});
    }
};

(function(){
    eeSDK.loadModule('/ajax.js', function(){
        eeSDK.ajax = ajax;
    });

    eeSDK.loadModule('/appBuilder.js', function(){
        eeSDK.appBuilder = appBuilder;
    });
})();