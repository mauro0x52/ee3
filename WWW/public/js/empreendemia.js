/*global Sdk: false, sdk: false, console: false, Ajax: false, Tracker: false, Ui: false, document: false, alert: false */

function getCookie(c_name)
{
    var i,
        x,
        y,
        ARRcookies=document.cookie.split(";");

    for (i=0;i<ARRcookies.length;i++)
    {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");

        if (x==c_name) {
            return unescape(y);
        }
    }
}

function setCookie(c_name,value,exdays)
{
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);

    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;
}

/** empreendemia
 *
 * @autor : Rafael Erthal
 * @since : 2012-09
 *
 * @description : javascript do corpo da empreendemia
 */
sdk.empreendemia = {

    /** start
     *
     * @autor : Rafael Erthal
     * @since : 2012-09
     *
     * @description : inicia o WWW do empreendemia
     */
    start : function () {
        this.menu.load();
        //this.welcome.load();
    },

    menu : {
        /** Load
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : carrega aplicativos do usuário no menu principal
         */
        load : function () {
            this.user = 'lalalalla';
            sdk.apps.listCompulsoryApps(function (apps) {
                var i;

                for (i = 0; i < apps.length; i++) {
                    apps[i].versions(function (versions) {
                        var i;

                        for (i = 0; i < versions.length; i++) {
                            versions[i].tools(function (tools) {
                                var i;

                                for (i = 0; i < tools.length; i++) {
                                    sdk.empreendemia.menu.add(tools[i]);
                                }
                            });
                        }
                    });
                }
            });
        },

        /** Add
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : adiciona aplicativo no menu principal
         */
        add : function (tool) {
            var container = document.getElementById('top-menu-tools'),
                li = document.createElement('li'),
                anchor = document.createElement('a');

            anchor.setAttribute('href','#!/' + tool.slug);
            anchor.innerHTML = tool.name;
            anchor.addEventListener('click', function () {
                tool.load();
            });

            li.appendChild(anchor);
            container.appendChild(li);

        }
    },

    welcome : {

        /** Load
         *
         * @autor : Rafael Erthal
         * @since : 2012-09
         *
         * @description : monta barra de welcome para usuário
         */
        load : function () {
            var userName = document.querySelectorAll('.user-name')[0];

            if (userName) {
                userName.innerHTML = this.user.name;
            }
        }
    }
}

