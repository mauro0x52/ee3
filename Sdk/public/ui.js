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
        Frame,
        Image;

    /** Element
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta a comunicação dos objetos da UI com o DOM
     */
    Element = function (id, type) {
        var //método privados
            addChild,
            removeChild,
            addAttribute,
            removeAttribute,
            addEvent,
            removeEvent,
            //atributos privados
            childs_objects = [],
            attributes_objects = [],
            events_objects = [],
            value_object,
            //atributo privilegiado
            that = this,
            HTMLobject = document.createElement(type);

        this.changeId = function (val) {
            id = val;
        };

        /** Childs
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : objeto que controla os filhos da tag
         */
        this.childs = {
            /** get
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : retorna lista de filhos
             * @param ids : vetor ou um unico id dos filhos a serem recuperados
             */
            get : function (ids) {
                var i,
                    res;

                if (ids === undefined) {
                    res = childs_objects;
                } else if (ids.constructor === Array) {
                    res = [];
                    for (i = 0; i < ids.length; i = i + 1) {
                        res.push(this.get(ids[i]));
                    }
                } else if (ids.constructor === String) {
                    for (i = 0; i < childs_objects.length; i = i + 1) {
                        if (childs_objects[i].id === ids) {
                            res = childs_objects[i];
                        }
                    }
                }
                return res;
            },

            /** add
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : adiciona um ou mais filhos à tag
             * @param elements : vetor ou um unico objeto a ser adicionado
             */
            add : function (elements) {
                var i;

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        this.add(elements[i]);
                    }
                } else {
                    addChild(elements);
                }
            },

            /** remove
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : remove lista de filhos
             * @param ids : vetor ou um unico id dos filhos a serem removidos
             */
            remove : function (ids) {
                var i,
                    elements = this.get(ids);

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        removeChild(elements[i]);
                    }
                } else {
                    removeChild(elements);
                }
            }
        };

        /** Attributes
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : objeto que controla atributos da tag
         */
        this.attributes = {
            /** get
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : retorna lista de atributos
             * @param ids : vetor ou um unico id dos atributos a serem recuperados
             */
            get : function (ids) {
                var i,
                    res;

                if (ids === undefined) {
                    res = attributes_objects;
                } else if (ids.constructor === Array) {
                    res = [];
                    for (i = 0; i < ids.length; i = i + 1) {
                        res.push(this.get(ids[i]));
                    }
                } else if (ids.constructor === String) {
                    for (i = 0; i < attributes_objects.length; i = i + 1) {
                        if (attributes_objects[i].name === ids) {
                            res = attributes_objects[i];
                        }
                    }
                }
                return res;
            },

            /** add
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : adiciona um ou mais atributos à tag
             * @param elements : vetor ou um unico objeto a ser adicionado
             */
            add : function (elements) {
                var i;

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        this.add(elements[i]);
                    }
                } else {
                    addAttribute(elements);
                }
            },

            /** remove
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : remove lista de atributos
             * @param ids : vetor ou um unico id dos atributos a serem removidos
             */
            remove : function (ids) {
                var i,
                    elements = this.get(ids);

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        this.remove(elements[i]);
                    }
                } else {
                    removeAttribute(elements);
                }
            }
        };

        /** Events
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : objeto que controla eventos da tag
         */
        this.events = {

            /** get
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : retorna lista de eventos
             * @param ids : vetor ou um unico id dos eventos a serem recuperados
             */
            get : function (ids) {
                var i,
                    res;

                if (ids === undefined) {
                    res = events_objects;
                } else if (ids.constructor === Array) {
                    res = [];
                    for (i = 0; i < ids.length; i = i + 1) {
                        res.push(this.get(ids[i]));
                    }
                } else if (ids.constructor === String) {
                    for (i = 0; i < events_objects.length; i = i + 1) {
                        if (events_objects[i].id === ids) {
                            res = events_objects[i];
                        }
                    }
                }
                return res;
            },

            /** add
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : adiciona um ou mais eventos à tag
             * @param elements : vetor ou um unico objeto a ser adicionado
             */
            add : function (elements) {
                var i;

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        this.add(elements[i]);
                    }
                } else {
                    addEvent(elements);
                }
            },

            /** remove
             *
             * @autor : Rafael Erthal
             * @since : 2012-08
             *
             * @description : remove lista de eventos
             * @param ids : vetor ou um unico id dos eventos a serem removidos
             */
            remove : function (ids) {
                var i,
                    elements = this.get(ids);

                if (elements.constructor === Array) {
                    for (i = 0; i < elements.length; i = i + 1) {
                        this.remove(elements[i]);
                    }
                } else {
                    removeEvent(elements);
                }
            }
        };

        /** addChild
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : adiciona um filho ao objeto
         * @param element : filho a ser inserido
         */
        addChild = function (element) {
            childs_objects.push(element);
            if (HTMLobject && element && element.add) {
                element.add(HTMLobject);
            }
        };

        /** removeChild
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove um filho do objeto
         * @param element : filho a ser removido
         */
        removeChild = function (element) {
            if (HTMLobject && element && element.remove) {
                //TODO remover do array
                element.remove();
            }
        };

        /** addAttribute
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : adiciona um atributo a tag
         * @param element : atributo a ser inserido
         */
        addAttribute = function (element) {
            attributes_objects.push(element);
            if (HTMLobject && element && element.name && element.value) {
                HTMLobject.setAttribute(element.name, element.value);
            }
        };

        /** removeAttribute
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove um atributo da tag
         * @param element : atributo a ser removido
         */
        removeAttribute = function (element) {
            if (HTMLobject && element && element.name) {
                //TODO remover do array
                HTMLobject.removeAttribute(element.name)
            }
        };

        /** addEvent
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : adiciona um evento à tag
         * @param element : evento a ser inserido
         */
        addEvent = function (element) {
            events_objects.push(element);
            if (HTMLobject && element && element.event && element.callback) {
                HTMLobject.addEventListener(element.event, function () {
                    element.callback.apply(app);
                }, true);
            }
        };

        /** removeEvent
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove um evento da tag
         * @param element : evento a ser removido
         */
        removeEvent = function (element) {
            if (HTMLobject && element && element.event && element.callback) {
                //TODO remover do array
                HTMLobject.removeEventListener(element.event, element.callback, true);
            }
        };

        /** value
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : retorna ou edita o valor dentro da tag
         * @param value : parâmetro opcional, caso setado altera o valor da tag
         * @param insetionType : parâmetro opcional, diz aonde o valor deve ser inserido
         */
        this.value = function (value, insetionType) {
            if (value) {
                if (!insetionType) {
                    value_object = value.replace(/<\/?[^>]+(>|$)/g, "");
                } else if (insetionType === "before") {
                    value_object = value.replace(/<\/?[^>]+(>|$)/g, "") + value_object;
                } else if (insetionType === "after") {
                    value_object = value_object + value.replace(/<\/?[^>]+(>|$)/g, "");
                } else {
                    throw 'invalid inserion type';
                }
                if (HTMLobject) {
                    HTMLobject.innerHTML = value;
                }
            } else {
                return HTMLobject.innerHTML;
            }
        };

        /** add
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : adiciona o objeto a um pai
         * @param parent : elemento que vai ter o objeto inserido
         */
        this.add = function (parent) {
            if (HTMLobject && parent && parent.appendChild) {
                parent.appendChild(HTMLobject);
            }
        };

        /** remove
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : remove o objeto do pai
         */
        this.remove = function () {
            if (HTMLobject && HTMLobject.parentNode) {
                HTMLobject.parentNode.removeChild(HTMLobject);
            }
        };

        addAttribute({name : 'id', value : id});
    };

    /** Image
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag img
     * @param id : id do objeto a ser criado
     * @param src : url da imagem
     * @param alt : texto alternativo à imagem
     */
    var Image = function (params) {
        var element = new Element(params.id, 'img');

        if (!params.src) {
            throw 'image source is required';
        }

        if (!params.alt) {
            throw 'alt is required';
        }

        element.attributes.add({name : 'src', value : params.src});
        element.attributes.add({name : 'alt', value : params.alt});

        this.add = element.add;
        this.remove = element.remove;
        this.src = function (value) {
            if (value) {
                element.attributes.remove('src');
                element.attributes.add({name : 'src', value : value});
            } else {
                return element.attributes.get('src').value;
            }
        };
        this.alt = function (value) {
            if (value) {
                element.attributes.remove('alt');
                element.attributes.add({name : 'alt', value : value});
            } else {
                return element.attributes.get('alt').value;
            }
        };
    };

    /** Strong
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag b
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Strong = function (params) {
        var element = new Element(params.id, 'b');

        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;

        this.value(params.value);
    };

    /** Italic
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag i
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Italic = function (params) {
        var element = new Element(params.id, 'i');

        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;

        this.value(params.value);
    };

    /** Paragraph
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag p
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Paragraph = function (params) {
        var element = new Element(params.id, 'p');

        this.add = element.add;
        this.remove = element.remove;
        this.content = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === String) {
                        element.value(element.value() + obj, "after");
                    } else if (obj.constructor === Array) {
                        for (i = 0; i < obj.length; i = i + 1) {
                            this.add(obj[i]);
                        }
                    } else {
                        if (obj.img) {
                            element.childs.add(new Image({
                                id    : obj.id,
                                url   : obj.img,
                                alt   : obj.alt
                            }));
                        }
                        if (obj.b) {
                            element.childs.add(new Strong({
                                id    : obj.id,
                                value : obj.b
                            }));
                        }
                        if (obj.i) {
                            element.childs.add(new Italic({
                                id    : obj.id,
                                value : obj.i
                            }));
                        }
                        if (obj.a) {
                            element.childs.add(new Italic({
                                id    : obj.id,
                                value : obj.a,
                                click : obj.click
                            }));
                        }
                    }
                } else {
                    return element.value();
                }
            }
        };

        this.content.add(params.content);
    };

    /** Heading
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag h1,h2,...,h7
     * @param id : id do objeto a ser criado
     * @param type : tipo de header h1,h2,...,h7
     * @param value : valor a ser colocado no interior da tag
     */
    var Heading = function (params) {
        var element = new Element(params.id, 'h' + params.type);

        if (!params.type) {
            throw 'heading type is required';
        }

        if (params.type < 1 || params.type > 7) {
            throw 'invalid heading type';
        }

        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;

        this.value(params.value);
    };

    /** Span
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag span
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Span = function (params) {
        var element = new Element(params.id, 'span');

        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;

        this.value(params.value);
    };

    /** Achor
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag a
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     * @param url : target da ancora
     * @param click : callback a ser chamado após click
     */
    var Anchor = function (params) {
        var element = new Element(params.id, 'a');

        if (!params.click) {
            throw 'click callback is required';
        }

        element.events.add({event : 'click', callback : function () {
            /* TODO chamar o atualizador de URL */
            params.click.apply(app);
        }});

        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;

        this.value(params.value);
    };

    /** Div
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag div
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Div = function (params) {
        var element = new Element(params.id, 'div');

        this.add = element.add;
        this.remove = element.remove;
        this.content = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        for (i = 0; i < obj.length; i = i + 1) {
                            this.add(obj[i], "after");
                        }
                    } else {
                        if (obj.p) {
                            element.childs.add(new Paragraph({
                                id : obj.id,
                                content : obj.p
                            }));
                        }
                        if (obj.title) {
                            element.childs.add(new Heading({
                                id : obj.id,
                                type : 3,
                                value : obj.title
                            }));
                        }
                        if (obj.subtitle) {
                            element.childs.add(new Heading({
                                id : obj.id,
                                type : 4,
                                value : obj.subtitle
                            }));
                        }
                    }
                } else {
                    return element.value();
                }
            }
        };

        this.content.add(params.content);
    };

    /** Form
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag form
     * @param id : id do objeto a ser criado
     * @param submit : callback a ser chamado que for dado submit
     * @param submitLabel : label do botão de submit
     */
    var Form = function (params) {
        var element = new Element(params.id, 'form'),
            submit = new Element(params.id, 'input');

        if (!params.submitLabel) {
            throw 'submitLabel is required';
        }

        if (!params.submit) {
            throw 'submit is required';
        }

        submit.attributes.add({name : 'type', value : 'submit'});
        submit.attributes.add({name : 'value', value : params.submitLabel});
        element.events.add({event : 'submit', callback : params.submit});

        this.add = element.add;
        this.remove = element.remove;

        this.fieldsets = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj.constructor === Array) {
                    for (i = 0; i < obj.length; i++) {
                        this.add(obj[i]);
                    }
                } else {
                    element.childs.add(new Fieldset(obj));
                }
            }
        };

        this.fieldsets.add(params.fieldsets);
        element.childs.add(submit);
    };

    /** Fieldset
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag fieldset
     * @param id : id do objeto a ser criado
     * @param legend : legend do fieldset
     */
    var Fieldset = function (params) {
        var element = new Element(params.id, 'fieldset'),
            legend = new Element(params.id, 'legend');

        legend.value(params.legend);

        this.add = element.add;
        this.remove = element.remove;

        this.inputs = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj.constructor === Array) {
                    for (i = 0; i < obj.length; i++) {
                        this.add(obj[i]);
                    }
                } else {
                    element.childs.add(new Input(obj));
                }
            }
        };

        element.childs.add(legend);
        this.inputs.add(params.inputs);
    };

    /** Input
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input
     * @param id : id do objeto a ser criado
     */
    var Input = function (params) {
        var element= new Element(params.id, 'textarea'),
            label = new Element(undefined, 'label'),
            input,
            i;

        label.value(params.label);
        label.attributes.add({name : 'for', value : params.id});

        if (params.type === 'textarea') {
            input = new Element(undefined, 'textarea');
            input.attributes.add({name : 'name', value : params.id});
            input.value(params.value);
            element.childs.add(input);
        } else if (params.type === 'select') {
            input = new Element(undefined, 'select');
            input.attributes.add({name : 'name', value : params.id});
            for (i in params.options) {
                var option = new Element(undefined, 'option');
                option.attributes.add({name : 'name', value : i});
                option.value(params.options[i]);
                input.childs.add(option);
            }
            element.childs.add(input);
        } else if (params.type === 'radio') {
            for (i in params.options) {
                var option = new Element(undefined, 'input');
                option.attributes.add({name : 'type', value : 'radio'});
                option.attributes.add({name : 'name', value : params.id});
                option.attributes.add({name : 'value', value : i});
                element.childs.add(option);
                element.value(params.options[i], "after")
            }
        } else if (params.type === 'text') {
            input = new Element(undefined, 'input');
            option.attributes.add({name : 'type', value : 'text'});
            input.attributes.add({name : 'name', value : params.id});
            input.attributes.add({name : 'value', value : params.value});
            element.childs.add(input);
        } else if (params.type === 'passowrd') {
            input = new Element(undefined, 'input');
            option.attributes.add({name : 'type', value : 'password'});
            input.attributes.add({name : 'name', value : params.id});
            input.attributes.add({name : 'value', value : params.value});
            element.childs.add(input);
        } else if (params.type === 'checkbox') {
            input = new Element(undefined, 'input');
            option.attributes.add({name : 'type', value : 'checkbox'});
            input.attributes.add({name : 'name', value : params.id});
            input.attributes.add({name : 'value', value : params.value});
            element.childs.add(input);
        } else {
            throw 'invalid input type'
        }

        this.add = element.add;
        this.remove = element.remove;
    };

    /** MenuOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa uma opção do menu principal
     * @param id : id do objeto a ser criado
     * @param src : url do icone
     * @param description : descrição do icone
     */
    var MenuOption = function (params) {
        var element = new Element(params.id, 'span'),
            image = new Image({src : params.src, alt : params.description}),
            description = new Span({value : params.description});

        if (!params.click) {
            throw 'click callback is required';
        }

        element.childs.add([image, description]);
        element.events.add({event : 'click', callback : params.click});

        this.add = element.add;
        this.remove = element.remove;
        this.src = image.src;
        this.description = description.value;
    };

    /** BrowseOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa um item na barra lateral
     * @param id : id do objeto a ser criado
     * @param src : url do icone
     * @param title : titulo do item
     * @param description : descrição do item
     */
    var browseOption = function (params) {
        var element = new Element(params.id, 'li'),
            image = new Image({src : params.src, alt : params.title}),
            title = new Span({value : params.title}),
            description = new Span({value : params.description});

        element.childs.add([image, title, description]);
        element.events.add({event : 'click', callback : params.click});

        this.add = element.add;
        this.remove = element.remove;
        this.src = image.src;
        this.title = title.value;
        this.description = description.value;
    };

    /** TabOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description :
     * @param id : id do objeto a ser criado
     * @param src : url do icone
     * @param
     * @param
     */
    var tabOption = function (params, contentContainer) {
        var element = new Element(params.id, 'li'),
            image = new Image({src : params.src, alt : params.description}),
            description = new Span({value : params.description});

        element.childs.add([image, description]);

        this.add = element.add;
        this.remove = element.remove;
        this.src = image.src;
        this.description = description.value;

        element.events.add({event : 'click', callback : function () {
            contentContainer.value(' ');
            contentContainer.childs.add(new Div({
                content : params.value
            }));
        }});
    };

    /** Menu
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta o menu principal da UI
     */
    Menu = function () {
        var element = new Element('menu', 'div'),
            navigation = new Element('navigation', 'div'),
            actions = new Element('actions', 'div');

        element.childs.add([navigation, actions]);

        this.add = element.add;
        this.remove = element.remove;

        this.navigation = {
            get    : navigation.childs.get,
            remove : navigation.childs.remove,
            add    : function (obj) {
                navigation.childs.add(new MenuOption(obj));
            }
        };

        this.actions = {
            get    : actions.childs.get,
            remove : actions.childs.remove,
            add    : function (obj) {
                actions.childs.add(new MenuOption(obj));
            }
        };
    };

    /** List
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta lista de elementos da UI
     */
    List = function () {
        var element = new Element('list', 'div'),
            filter = new Form({
                id : 'filter',
                submitLabel : 'filtrar',
                submit : function () {

                },
                fieldsets : {
                    legend : 'filtrar'
                }
            }),
            browse = new Element('browse', 'ul'),
            count = new Element('count', 'li');

        browse.childs.add([count]);
        element.childs.add([filter, browse]);

        this.add = element.add;
        this.remove = element.remove;

        this.browse = {
            get    : browse.childs.get,
            remove : function (ids) {
                browse.childs.remove(ids);
                count.value(browse.childs.get().length - 1 + " resultados encontrados");
            },
            add    : function (obj) {
                browse.childs.add(new browseOption(obj));
                count.value(browse.childs.get().length - 1 + " resultados encontrados");
            }
        };

        this.filter = {
            get    : filter.childs.get,
            remove : function (ids) {

            },
            add    : function (obj) {

            }
        };

        count.value('nenhum resultado encontrado');
    };

    /** Frame
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta a janela principal da UI
     */
    Frame = function () {
        var element = new Element('frame', 'div'),
            title = new Heading({type : 1}),
            subtitle = new Heading({type : 2}),
            head = new Element('head', 'div'),
            tabs = new Element('tabs', 'ul'),
            content = new Element('content', 'div');

        head.childs.add([title,subtitle, tabs]);
        element.childs.add([head, content]);

        this.add = element.add;
        this.remove = element.remove;

        this.head = {
            title    : title.value,
            subtitle : subtitle.value
        };
        this.tabs = {
            get : tabs.childs.get,
            remove : function () {
                content.value(' ');
                tabs.childs.remove()
            },
            add : function (params) {
                tabs.childs.add(new tabOption(params, content));
            }
        };
    };

    /*Montando o namespace da UI*/
    this.menu = new Menu();
    this.list = new List();
    this.frame = new Frame();

    this.menu.add(document.getElementById('app_container'));
    this.list.add(document.getElementById('app_container'));
    this.frame.add(document.getElementById('app_container'));
};