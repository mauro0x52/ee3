/*global sdk: false, document: false*/
function Element (type) {
    var HTMLobject = document.createElement(type);

    this.val = function (value) {
        if (value) {
            if (typeof value !== 'string') {
                throw 'invalid data type';
            }
            HTMLobject.innerHTML = value.clear();
            return this;
        } else {
            return HTMLobject.innerHTML;
        }
    };

    this.childs = {
        add : function (childs) {
            if (!this.embed) {
                throw 'invalid object inheritance';
            }
            HTMLobject.innerHTML = HTMLobject.innerHTML + this.embed(childs);
            return this;
        },
        remove : function (childs) {
            //TODO implementar
        },
        get : function (id) {
            if (id) {
                //busca e retorna um especifico
            } else {
                //retornar todos
            }
        }
    };

    this.clear = function () {
        HTMLobject.innerHTML = '';
    };

    this.update = function (value) {
        this.clear();
        this.add(value);
    };

    this.serialize = function() {
        var res = {},
            serialized = HTMLobject.serialize,
            inputName;

        for(inputName in serialized) {
            if (serialized.hasOwnProperty(inputName)) {
                res[inputName] = serialized[inputname].value;
            }
        }
        return res;
    };
}

function Menu (container) {
    var menu_element = document.createElement('div'),
        navigation_element = document.createElement('div'),
        browse_element = document.createElement('div');
    
    menu_element.appendChild(navigation_element);
    menu_element.appendChild(browse_element);
    container.appendChild(menu_element);

    this.navigation = new Collection();
    this.actions = new Collection();
}

function List (container) {
    var list_element = document.createElement('div'),
        filter_element = document.createElement('div'),
        browse_element = document.createElement('div');

    list_element.appendChild(filter_element);
    list_element.appendChild(browse_element);
    container.appendChild(list_element);

    this.collapse = function (collapsed) {
    
    }
    this.visible = function (visibility) {
    
    }
}

function Head (container) {
    var head_element = document.createElement('div'),
        toolbar_element = document.createElement('div'),
        buttons_element = document.createElement('div');

    head_element.appendChild(toolbar_element);
    head_element.appendChild(buttons_element);
    container.appendChild(head_element);
        
    this.setImage = function (image) {
        
    };
    this.setTitle = function (title) {
    
    };
    this.setSubtitle = function (subtitle) {
    
    };
}

function Tabs (container) {
}

function Frame (container) {
    var frame = document.createElement('div');
    container.appendChild(frame);

    this.head       = new Head(frame);
    this.tabs       = new Tabs(frame);
}

/** Ui
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de interface com o usuário
 */
function Ui (app) {
    var container = document.getElementById(app.getContainer());

    this.menu  = new Menu(container);
    this.list  = new List(container);
    this.frame = new Frame(container);
}