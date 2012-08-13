/*global sdk: false, document: false*/

/** Ui
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de interface com o usuário
 */
sdk.modules.ui = function (app) {
    "use strict";

    var Element,
        Menu,
        List,
        Frame;

    /** Element
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta a comunicação dos objetos da UI com o DOM
     */
    Element = function (id, type) {
        var Collection,
            innerHtml,
            value,
            val,
            remove,
            toString,
            setAttribute,
            getAttribute,
            childs,
            attributes = {},
            that = this;

        /** Collection
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : objeto que controla os filhos da tag
         */
        Collection = function () {
            var childs = [];

            /** add
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : adiciona um ou mais filhos ao objeto
             * @param newChilds : vetor ou um unico objeto a ser adicionado
             */
            this.add = function (newChilds) {
                var i;

                if (newChilds.constructor === Array) {
                    for (i = 0; i < newChilds.length; i = i + 1) {
                        childs.push(newChilds[i]);
                        this.add(newChilds[i]);
                    }
                } else {
                    innerHtml(innerHtml() + newChilds.toString());
                }
                return that;
            };

            /** remove
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : remove um ou mais filhos do objeto
             * @param id : vetor ou um unico id dos objetos a ser removido
             */
            this.remove = function (ids) {
                var i,
                    childs = this.get(ids);

                if (childs.constructor === Array) {
                    for (i = 0; i < childs.length; i = i + 1) {
                        childs[i].remove();
                    }
                } else {
                    childs.remove();
                }
            };

            /** get
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : retorna lista de objetos
             * @param id : vetor ou um unico id dos objetos a serem recuperados
             */
            this.get = function (ids) {
                var i,
                    res;

                if (ids === undefined) {
                    res = childs;
                } else if (ids.constructor === Array) {
                    res = [];
                    for (i = 0; i < childs.length; i = i + 1) {
                        res.push(this.get(childs[i]));
                    }
                } else if (ids.constructor === String) {
                    for (i = 0; i < childs.length; i = i + 1) {
                        if (childs[i].id === id) {
                            res = childs[i];
                        }
                    }
                }
                return res;
            };
        };

        /** innerHtml
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : retorna ou edita o valor dentro da tag
         * @param value : parâmetro opcional, caso setado altera o valor da tag
         */
        innerHtml = function (value) {
            var res,
                HTMLobject = document.getElementById(id);

            if (HTMLobject) {
                if (value) {
                    HTMLobject.innerHTML = value;
                    res = this;
                } else {
                    res = HTMLobject.innerHTML;
                }
            }
            return res;
        };

        /** value
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : retorna ou edita o valor dentro da tag
         * @param value : parâmetro opcional, caso setado altera o valor da tag
         */
        value = function (value) {
            if (value) {
                val = value;
            }

            return innerHtml(value.replace(/<\/?[^>]+(>|$)/g, ""));
        };

        /** Remove
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove a tag
         */
        remove = function () {
            var HTMLobject = document.getElementById(id);

            if (HTMLobject) {
                HTMLobject.parentElement.removeChild(HTMLobject);
            }
        };

        /** Embed
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove a tag
         */
        toString = function () {
            var res,
                a = childs.get(),
                i;

            res = '<' + type + '';
            if (id) {
                 res += ' id="' + id + '"';
            }

            for (i in attributes) {
                res += ' ' + i + '="' + attributes[i] + '"';
            }
            res += '>'
            
            for (i = 0; i < a.length; i = i + 1) {
                res += a[i].toString();
            }

            if (val) {
                res += val;
            }
            res += '</' + type + '>';
            return res;
        };

        /** SetAttribute
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : altera atributo de uma tag
         * @param attr : nome do atributo a ser alterado
         * @param value : novo valor do atributo
         */        
        setAttribute = function (attr, value) {
            var HTMLobject = document.getElementById(id);

            attributes[attr] = value;
            if (HTMLobject) {
                HTMLobject.setAttribute(attr, value);
            }
            return this;
        };

        /** GetAttribute
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : retorna o valor de um atributo de uma tag
         * @param attr : nome do atributo a ser buscado
         */
        getAttribute = function (attr) {
            var HTMLobject = document.getElementById(id),
                res;

            if (HTMLobject) {
                res = HTMLobject.getAttribute(attr);
            }
            return res;
        };

        childs = new Collection();

        this.childs = childs;
        this.value = value;
        this.remove = remove;
        this.toString = toString;
        this.setAttribute = setAttribute;
        this.getAttribute = getAttribute;
    };

    /** Menu
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta o menu principal da UI
     */
    Menu = function () {
        var childs = this.childs,
            menuElement,
            navigation = new Element('navigation', 'div'),
            actions = new Element('actions', 'div');

        menuElement = function (params) {
            var element = new Element(params.id, 'span'),
                image = new Element(undefined, 'img'),
                description = new Element(undefined, 'span');
    
            image.setAttribute('src', params.src);
            image.setAttribute('alt', params.description);
            description.value(params.description);
            
            element.childs.add([image, description]);
            return element;
        };

        this.childs = undefined;
        this.value = undefined;
        this.remove = undefined;
        this.setAttribute = undefined;
        this.getAttribute = undefined;
        this.changeId = undefined;

        this.navigation = {
            get    : navigation.childs.get,
            remove : navigation.childs.remove,
            add    : function (obj) {
                navigation.childs.add(menuElement(obj));
            }
        };

        this.actions = {
            get    : actions.childs.get,
            remove : actions.childs.remove,
            add    : function (obj) {
                actions.childs.add(menuElement(obj));
            }
        };

        childs.add([navigation, actions]);
    };
    Menu.prototype = new Element('menu', 'div');

    /** List
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta lista de elementos da UI
     */
    List = function () {
        var childs = this.childs,
            browseElement,
            filter = new Element('filter', 'form'),
            browse = new Element('browse', 'ul'),

        browseElement = function (params) {
            var element = new Element(params.id, 'li'),
                image = new Element(undefined, 'img'),
                title = new Element(undefined, 'span'),
                description = new Element(undefined, 'span');
    
            image.setAttribute('src', params.src);
            image.setAttribute('alt', params.description);
            title.value(params.title);
            description.value(params.description);
            
            element.childs.add([image, title, description]);
            return element;
        };

        this.childs = undefined;
        this.value = undefined;
        this.remove = undefined;
        this.setAttribute = undefined;
        this.getAttribute = undefined;
        this.changeId = undefined;

        this.filter = {
            //TODO pensar
        };

        this.browse = {
            get    : browse.childs.get,
            remove : function (ids) {
                browse.childs.remove(ids);
            },
            add    : function (obj) {
                browse.childs.add(new browseElement(obj));
            }
        };

        childs.add([filter, browse]);
    };
    List.prototype = new Element('list', 'div');

    /** Frame
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta a janela principal da UI
     */
    Frame = function () {
        var childs = this.childs,
            title = new Element('title', 'h1'),
            subtitle = new Element('subtitle', 'h2'),
            head = new Element('head', 'div'),
            tabs = new Element('tabs', 'div');

        this.childs = undefined;
        this.value = undefined;
        this.remove = undefined;
        this.setAttribute = undefined;
        this.getAttribute = undefined;
        this.changeId = undefined;

        this.head = {
            title    : title.value,
            subtitle : subtitle.value
        };

        this.tabs = {
            get    : tabs.childs.get,
            remove : tabs.childs.remove,
            add    : function (obj) {
                tabs.childs.add(new tabElement(obj));
            }
        };

        head.childs.add([title,subtitle]);
        childs.add([head, tabs]);
    };
    Frame.prototype = new Element('frame', 'div');
    
    /*Montando o namespace da UI*/
    this.menu = new Menu();
    this.list = new List();
    this.frame = new Frame();

    document.getElementById('app_container').innerHTML = this.menu.toString() + this.list.toString() + this.frame.toString();
};