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
        var /* Método privados */
            addChild,
            removeChild,
            addAttribute,
            removeAttribute,
            addEvent,
            removeEvent,
            /* Atributos privados */
            childs_objects = [],
            attributes_objects = [],
            events_objects = [],
            value_object,
            /* Elementos privilegiados */
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            this.add(elements[i]);
                        }
                    } else {
                        addChild(elements);
                    }
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            removeChild(elements[i]);
                        }
                    } else {
                        removeChild(elements);
                    }
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            this.add(elements[i]);
                        }
                    } else {
                        addAttribute(elements);
                    }
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            this.remove(elements[i]);
                        }
                    } else {
                        removeAttribute(elements);
                    }
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            this.add(elements[i]);
                        }
                    } else {
                        addEvent(elements);
                    }
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

                if (elements) {
                    if (elements.constructor === Array) {
                        for (i = 0; i < elements.length; i = i + 1) {
                            this.remove(elements[i]);
                        }
                    } else {
                        removeEvent(elements);
                    }
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
                HTMLobject.addEventListener(element.event, function (event) {
                    element.callback.apply(app);
                    event.preventDefault();
                    return false;
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

        /** serialize
         *
         * @autor : Rafael Erthal
         * @since : 2012-08
         *
         * @description : serializa os inputs de um formulário
         */
        this.serialize = function () {
            var res = {};

            for (var prop in HTMLobject) {
                if (HTMLobject.hasOwnProperty(prop)) {
                    res[prop] = HTMLobject[prop].value;
                }
            }

            return res;
        }

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

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.src = function (value) {
            if (value) {
                element.attributes.remove('src');
                element.attributes.add({name : 'src', value : value});
            } else {
                if (element.attributes.get('src')) {
                    return element.attributes.get('src').value;
                }
            }
        };
        this.alt = function (value) {
            if (value) {
                element.attributes.remove('alt');
                element.attributes.add({name : 'alt', value : value});
            } else {
                if (element.attributes.get('alt')) {
                    return element.attributes.get('alt').value;
                }
            }
        };

        /* Seta atributos da imagem */
        this.src(params.src);
        this.alt(params.alt);
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

        /* Seta valor da tag */
        element.value(params.value);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;
    };

    /** Span
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag b
     * @param id : id do objeto a ser criado
     * @param value : valor a ser colocado no interior da tag
     */
    var Span = function (params) {
        var element = new Element(params.id, 'span');

        /* Seta valor da tag */
        element.value(params.value);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;
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

        /* Seta valor da tag */
        element.value(params.value);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;
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

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Controle de conteudo do paragrafo */
        this.content = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === String) {
                        /* Se for texto, simplesmente colocar na tag */
                        element.value(element.value() + obj, "after");
                    } else if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i = i + 1) {
                            this.add(obj[i]);
                        }
                    } else if (obj.img) {
                        /* Cria uma imagem */
                        element.childs.add(new Image({
                            id    : obj.id,
                            url   : obj.img,
                            alt   : obj.alt
                        }));
                    } else if (obj.b) {
                        /* Texto em negrito */
                        element.childs.add(new Strong({
                            id    : obj.id,
                            value : obj.b
                        }));
                    } else if (obj.i) {
                        /* Texto em itálico */
                        element.childs.add(new Italic({
                            id    : obj.id,
                            value : obj.i
                        }));
                    } else if (obj.a) {
                        /* Cria uma ancora */
                        element.childs.add(new Anchor({
                            id    : obj.id,
                            value : obj.a,
                            click : obj.click
                        }));
                    } else if (obj.constructor === Anchor || obj.constructor === Italic || obj.constructor === Strong || obj.constructor === Image) {
                        /* Objeto já construido simplesmente adiciona-o */
                        element.childs.add(obj);
                    } else {
                        throw 'invalid object';
                    }
                }
            }
        };

        /* Seta valor da tag */
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

        /* Seta valor da tag */
        element.value(params.value);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;
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

        /* Seta valor da tag */
        element.value(params.value);

        /* Bindando clique da ancora */
        element.events.add({event : 'click', callback : function () {
            app.route.hash(params.url);
            params.click.apply(app);
        }});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.value = element.value;
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

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Controle de conteudo do div */
        this.content = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i = i + 1) {
                            this.add(obj[i], "after");
                        }
                    } else if (obj.p) {
                        /* Cria um parágrafo */
                        element.childs.add(new Paragraph({
                            id : obj.id,
                            content : obj.p
                        }));
                    } else if (obj.title) {
                        /* Cria um titulo */
                        element.childs.add(new Heading({
                            id : obj.id,
                            type : 3,
                            value : obj.title
                        }));
                    } else if (obj.subtitle) {
                        /* Cria um subtitulo */
                        element.childs.add(new Heading({
                            id : obj.id,
                            type : 4,
                            value : obj.subtitle
                        }));
                    } else if (obj.form) {
                        /* Cria um subtitulo */
                        element.childs.add(new Heading({
                            id : obj.id,
                            type : 4,
                            value : obj.subtitle
                        }));
                    } else if (obj.constructor === Paragraph || obj.constructor === Heading || obj.constructor === Form) {
                        /* Objeto já construido simplesmente adiciona-o */
                        element.childs.add(obj);
                    } else {
                        throw 'invalid object';
                    }
                }
            }
        };

        /* Seta valor da tag */
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
     * @param fieldsets : fieldsets do form
     */
    var Form = function (params) {
        var element = new Element(params.id, 'form'),
            submitDiv = new Element(undefined, 'div'),
            submit = new Element(undefined, 'input'),
            cb;

        if (!params.submitLabel) {
            throw 'submitLabel is required';
        }

        if (!params.submit) {
            throw 'submit is required';
        }

        /* Seta atributos do submit */
        submitDiv.attributes.add({name : 'class', value : 'submit'});
        submit.attributes.add({name : 'type', value : 'submit'});

        element.attributes.add({name : 'onsubmit', value : 'return false;'});
        element.events.add({event : 'submit', callback : function () {
            console.log('ola')
            if (cb) {
                cb(element.serialize());
            }
        }});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Controle dos fieldsets do form */
        this.fieldsets = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else if (obj.constructor === Fieldset) {
                        /* Objeto já construido simplesmente adiciona-o */
                        element.childs.add(obj)
                    } else {
                        /* Cria fieldset */
                        element.childs.add(new Fieldset(obj));
                    }
                }
            }
        };
        this.submitLabel = function (value) {
            if (value) {
                submit.attributes.remove('value');
                submit.attributes.add({name : 'value', value : value});
            } else {
                if (submit.attributes.get('value')) {
                    return submit.attributes.get('value').value;
                }
            }
        };
        this.submit = function (value) {
            if (value) {
                cb = value;
            } else {
                return cb;
            }
        };

        /* Seta valor da tag */
        this.fieldsets.add(params.fieldsets);
        element.childs.add(submitDiv);
        submitDiv.childs.add(submit);
        this.submitLabel(params.submitLabel);
        this.submit(params.submit);
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
            legend = new Element(undefined, 'legend');

        element.childs.add(legend);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.legend = legend.value;

        /* Controle dos inputs do fieldset */
        this.inputs = {
            get : element.childs.get,
            remove : element.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else if (obj.constructor === Input) {
                        /* Objeto já construido simplesmente adiciona-o */
                        element.childs.add(obj)
                    } else {
                        /* Cria input */
                        element.childs.add(new Input(obj));
                    }
                }
            }
        };

        /* Seta valor da tag */
        this.inputs.add(params.inputs);
        this.legend(params.legend);
    };

    /** InputText
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input type text
     * @param name : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputText = function (params) {
        var input = new Element('form-' + params.name, 'input'),
            dd = new Element(undefined, 'dd');

        dd.childs.add(input);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };

        this.value = function (value) {
            if (value) {
                input.attributes.remove('value');
                input.attributes.add({name : 'value', value : value});
            } else {
                if (input.attributes.get('value')) {
                    return input.attributes.get('value').value;
                }
            }
        };

        /* Seta valor da tag */
        this.name(params.name);
        this.value(params.value);
        input.attributes.add({name : 'type', value : 'text'});
    };

    /** InputTextArea
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input type text
     * @param name : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputTextArea = function (params) {
        var input = new Element('form-' + params.name, 'textarea'),
            dd = new Element(undefined, 'dd');

        dd.childs.add(input);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };

        this.value = input.value;

        /* Seta valor da tag */
        this.name(params.name);
        this.value(params.value);
    };

    /** InputPassword
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input type text
     * @param name : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputPassword = function (params) {
        var input = new Element('form-' + params.name, 'input'),
            dd = new Element(undefined, 'dd');

        dd.childs.add(input);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };

        this.value = function (value) {
            if (value) {
                input.attributes.remove('value');
                input.attributes.add({name : 'value', value : value});
            } else {
                if (input.attributes.get('value')) {
                    return input.attributes.get('value').value;
                }
            }
        };

        /* Seta valor da tag */
        this.name(params.name);
        this.value(params.value);
        input.attributes.add({name : 'type', value : 'password'});
    };

    /** InputCheckbox
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input type checkbox
     * @param name : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputCheckbox = function (params) {
        var input = new Element('form-' + params.name, 'input'),
            label = new Element(undefined, 'label'),
            dd = new Element(undefined, 'dd');

        dd.childs.add([input, label]);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value});
                /* Seta o atributo for */
                label.attributes.remove('for');
                label.attributes.add({name : 'for', value : 'form-' + value});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };
        this.value = function (value) {
            if (value) {
                input.attributes.remove('value');
                input.attributes.add({name : 'value', value : value});
            } else {
                if (input.attributes.get('value')) {
                    return input.attributes.get('value').value;
                }
            }
        };
        this.label = label.value

        /* Seta valor da tag */
        this.name(params.name);
        this.label(params.label);
        this.value(params.value);
        input.attributes.add({name : 'type', value : 'checkbox'});
        label.attributes.add({name : 'for', value : 'form-' + params.name})
    };

    /** InputRadio
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag input type radio
     * @param name : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputRadio = function (params) {
        var input = new Element('form-' + params.name, 'input'),
            label = new Element(undefined, 'label'),
            dd = new Element(undefined, 'dd');

        dd.childs.add([input, label]);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value + params.label});
                /* Seta o atributo for */
                label.attributes.remove('for');
                label.attributes.add({name : 'for', value : 'form-' + value + params.label});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };
        this.value = function (value) {
            if (value) {
                input.attributes.remove('value');
                input.attributes.add({name : 'value', value : value});
            } else {
                if (input.attributes.get('value')) {
                    return input.attributes.get('value').value;
                }
            }
        };

        this.label = label.value;

        /* Seta valor da tag */
        this.name(params.name);
        this.label(params.label);
        this.value(params.value);
        input.attributes.add({name : 'type', value : 'radio'});
    };

    /** InputSelect
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag select
     * @param name : id do objeto a ser criado
     * @param optgroups : optgroups do select
     */
    var InputSelect = function (params) {
        var input = new Element('form-' + params.name, 'select'),
            dd = new Element(undefined, 'dd');

        dd.childs.add(input);

        /* Publicando métodos privados */
        this.add = dd.add;
        this.remove = dd.remove;
        this.name = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('name');
                input.attributes.add({name : 'name', value : value});
                /* Seta o atributo id */
                input.attributes.remove('id');
                input.attributes.add({name : 'id', value : 'form-' + value});
            } else {
                if (input.attributes.get('name')) {
                    return input.attributes.get('name').value;
                }
            }
        };

        this.options = {
            get : input.childs.get,
            remove : input.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else if (obj.constructor === InputOption || obj.constructor === InputOptgroup) {
                        /* Objeto já construido simplesmente adiciona-o */
                        input.childs.add(obj)
                    } else {
                        /* Cria input */
                        if (obj.options) {
                            input.childs.add(new InputOptgroup(obj));
                        } else {
                            input.childs.add(new InputOption(obj));
                        }
                    }
                }
            }
        };

        /* Seta valor da tag */
        this.name(params.name);
        this.options.add(params.options);
    };

    /** InputOptgroup
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag select
     * @param label : id do objeto a ser criado
     * @param options : opções do optgroup
     */
    var InputOptgroup = function (params) {
        var input = new Element(undefined, 'optgroup');

        /* Publicando métodos privados */
        this.add = input.add;
        this.remove = input.remove;
        this.label = function (value) {
            if (value) {
                /* Seta o atributo name */
                input.attributes.remove('label');
                input.attributes.add({name : 'label', value : value});
            } else {
                if (input.attributes.get('label')) {
                    return input.attributes.get('label').value;
                }
            }
        };

        this.options = {
            get : input.childs.get,
            remove : input.childs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else if (obj.constructor === InputOption || obj.constructor === InputOptgroup) {
                        /* Objeto já construido simplesmente adiciona-o */
                        input.childs.add(obj)
                    } else {
                        /* Cria input */
                        if (obj.options) {
                            input.childs.add(new InputOptgroup(obj));
                        } else {
                            input.childs.add(new InputOption(obj));
                        }
                    }
                }
            }
        };

        /* Seta valor da tag */
        this.label(params.label);
        this.options.add(params.options);
    };

    /** InputOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa a tag select
     * @param label : id do objeto a ser criado
     * @param value : valor padrão do input
     */
    var InputOption = function (params) {
        var input = new Element('form-' + params.name, 'option');

        /* Publicando métodos privados */
        this.add = input.add;
        this.remove = input.remove;
        this.label = input.value;
        this.value = function (value) {
            if (value) {
                input.attributes.remove('value');
                input.attributes.add({name : 'value', value : value});
            } else {
                if (input.attributes.get('value')) {
                    return input.attributes.get('value').value;
                }
            }
        };

        /* Seta valor da tag */
        this.label(params.label);
        this.value(params.value);
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
        var element = new Element(undefined, 'dl'),
            dt = new Element(undefined, 'dt'),
            label = new Element(undefined, 'label'),
            input;

        dt.childs.add(label);

        /* Montando inputs */
        switch (params.type) {
            case 'text' :
                /* Input text */
                input = new InputText({
                    name : params.name,
                    value : params.value
                });
                element.childs.add([dt,input]);

                /* Publicando métodos privados */
                this.name = function (value) {
                    if (value) {
                        input.name(value);
                        label.attributes.remove('for');
                        label.attributes.add({name : 'for', value : 'form-' + value});
                    } else {
                        return input.name();
                    }
                };
                this.value = input.value;
                this.name(params.name);
                break;

            case 'textarea' :
                /* Input text */
                input = new InputTextArea({
                    name : params.name,
                    value : params.value
                });
                element.childs.add([dt,input]);

                /* Publicando métodos privados */
                this.name = function (value) {
                    if (value) {
                        input.name(value);
                        label.attributes.remove('for');
                        label.attributes.add({name : 'for', value : 'form-' + value});
                    } else {
                        return input.name();
                    }
                };
                this.value = input.value;
                this.name(params.name);
                break;

            case 'password':
                /* Input password */
                input = new InputPassword({
                    name : params.name,
                    value : params.value
                });
                element.childs.add([dt,input]);

                /* Publicando métodos privados */
                this.name = function (value) {
                    if (value) {
                        input.name(value);
                        label.attributes.remove('for');
                        label.attributes.add({name : 'for', value : 'form-' + value});
                    } else {
                        return input.name();
                    }
                };
                this.value = input.value;
                this.name(params.name);
                break;

            case 'checkbox' :
                /* Input checkbox */
                element.childs.add(dt);

                /* Publicando métodos privados */
                this.checkboxes = {
                    get : element.childs.get,
                    remove : element.childs.remove,
                    add : function (obj) {
                        var i;

                        if (obj) {
                            if (obj.constructor === Array) {
                                /* Se for um array inserir cada um dos elementos */
                                for (i = 0; i < obj.length; i++) {
                                    this.add(obj[i]);
                                }
                            } else if (obj.constructor === InputCheckbox) {
                                /* Objeto já construido simplesmente adiciona-o */
                                element.childs.add(obj)
                            } else {
                                /* Cria input */
                                element.childs.add(new InputCheckbox(obj));
                            }
                        }
                    }
                };

                this.checkboxes.add(params.checkboxes);
                break;

            case 'radio' :
                /* Input checkbox */
                element.childs.add(dt);

                /* Publicando métodos privados */
                this.radios = {
                    get : element.childs.get,
                    remove : element.childs.remove,
                    add : function (obj) {
                        var i;

                        if (obj) {
                            if (obj.constructor === Array) {
                                /* Se for um array inserir cada um dos elementos */
                                for (i = 0; i < obj.length; i++) {
                                    this.add(obj[i]);
                                }
                            } else if (obj.constructor === InputRadio) {
                                /* Objeto já construido simplesmente adiciona-o */
                                element.childs.add(obj)
                            } else {
                                /* Cria input */
                                element.childs.add(new InputRadio(obj));
                            }
                        }
                    }
                };

                for (var i = 0; i < params.radios.length; i++) {
                    params.radios[i].name = params.name;
                }

                this.radios.add(params.radios);
                break;

            case 'select':
                /* Input select */
                input = new InputSelect({
                    name : params.name,
                    options : params.options
                });
                element.childs.add([dt,input]);

                /* Publicando métodos privados */
                this.name = function (value) {
                    if (value) {
                        input.name(value);
                        label.attributes.remove('for');
                        label.attributes.add({name : 'for', value : 'form-' + value});
                    } else {
                        return input.name();
                    }
                };
                this.optgroups = input.optgroups;
                this.name(params.name);
                break;

            default :
                throw 'invalid input type'
        }

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.label = label.value;

        this.label(params.label);
    };

    /** MenuOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implementa uma opção do menu principal
     * @param id : id do objeto a ser criado
     * @param image : classe do icone
     * @param url : url do link
     * @param description : descrição do icone
     */
    var MenuOption = function (params) {
        var element = new Element(params.id, 'li'),
            anchor = new Element(undefined, 'a'),
            icon = new Element(undefined, 'span'),
            legend = new Element(undefined, 'span'),
            arrow = new Div({});

        element.childs.add(anchor);
        anchor.childs.add([icon, legend, arrow]);

        legend.attributes.add({name : 'class', value : 'legend'});
        icon.attributes.add({name : 'class', value : 'image'});
        icon.attributes.add({name : 'class', value : 'image arrow'});
        anchor.attributes.add({name : 'href' , value : params.url});

        if (!params.click) {
            throw 'click callback is required';
        }

        /* Bindando clique da ancora */
        anchor.events.add({event : 'click', callback : function () {
            app.route.hash(params.url);
            params.click.apply(app);
        }});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.description = legend.value;
        this.image = function (value) {
            if (value) {
                icon.attributes.remove('class');
                icon.attributes.add({name : 'class', value : 'image ' + value});
            } else {
                if (icon.attributes.get('class')) {
                    return icon.attributes.get('class').value;
                }
            }
        }
        this.image(params.image);
        this.description(params.description);
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
        var element = new Element(undefined, 'li'),
            anchor = new Element(undefined, 'a'),
            thumbnail = new Element(undefined, 'span'),
            thumbnailImage = new Image({src : params.thumbnail.src, alt : params.thumbnail.alt}),
            title = new Element(undefined, 'span'),
            subtitle = new Element(undefined, 'span'),
            description = new Element(undefined, 'span'),
            footer = new Element(undefined, 'span'),
            arrow = new Element(undefined, 'div');

        element.childs.add([anchor, arrow]);
        anchor.childs.add([thumbnail, title, subtitle, description, footer]);
        thumbnail.childs.add(thumbnailImage);

        title.value(params.title);
        subtitle.value(params.subtitle);
        description.value(params.description);
        footer.value(params.footer);

        thumbnail.attributes.add({name : 'class', value : 'thumbnail'});
        title.attributes.add({name : 'class', value : 'title'});
        subtitle.attributes.add({name : 'class', value : 'subtitle'});
        description.attributes.add({name : 'class', value : 'description'});
        footer.attributes.add({name : 'class', value : 'footer'});
        arrow.attributes.add({name : 'class', value : 'image arrow'});

        if (!params.click) {
            throw 'click callback is required';
        }

        /* Bindando clique da ancora */
        anchor.events.add({event : 'click', callback : function () {
            params.click.apply(app);
        }});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.title = title.value;
        this.subtitle = subtitle.value;
        this.description = description.value;
        this.footer = footer.value;
    };

    /** TabOption
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description :
     * @param id : id do objeto a ser criado
     * @param src : url do icone
     * @param description : descrição do item
     * @param value : valor que aparece na aba
     */
    var tabOption = function (params, contentContainer) {
        var element = new Element(undefined, 'li'),
            anchor = new Element(undefined, 'a')

        element.childs.add(anchor);
        anchor.value(params.description);

        /* Bindando clique da aba para exibir conteudo */
        anchor.events.add({event : 'click', callback : function () {
            contentContainer.value(' ');
            if (params.value) {
                if (params.value.constructor === Div) {
                    contentContainer.childs.add(params.value);
                } else {
                    contentContainer.childs.add(new Div({
                        content : params.value
                    }));
                }
            }
        }});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;
        this.description = anchor.value;
    };

    /** Menu
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta o menu principal da UI
     */
    Menu = function () {
        var element = new Element(undefined, 'nav'),
            div = new Element('tool-menu', 'div'),
            navigation = new Element('tool-menu-navigation', 'menu'),
            actions = new Element('tool-menu-actions', 'menu'),
            settings = new Element('tool-menu-settings', 'menu');

        div.childs.add([navigation, actions, settings]);
        element.childs.add(div);

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Ítens de navegação do menu */
        this.navigation = {
            get    : navigation.childs.get,
            remove : navigation.childs.remove,
            add    : function (obj) {
                var i;

                if (obj) {
                    if (obj.contructor === Array) {
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else {
                        navigation.childs.add(new MenuOption(obj));
                    }
                }
            }
        };
        /* Ítens de cadastro de menu */
        this.actions = {
            get    : actions.childs.get,
            remove : actions.childs.remove,
            add    : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else {
                        actions.childs.add(new MenuOption(obj));
                    }
                }
            }
        };
        /* Ítens de configuração de menu */
        this.actions = {
            get    : settings.childs.get,
            remove : settings.childs.remove,
            add    : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else {
                        settings.childs.add(new MenuOption(obj));
                    }
                }
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
        var element = new Element(undefined, 'nav'),
            div = new Element('tool-list', 'div'),
            filter = new Element('tool-list-filter', 'div'),
            imageFilter = new Element(undefined, 'div'),
            filterForm = new Form({
                id : 'filter',
                submit : function () {
                    return false;
                },
                submitLabel : 'Filtrar',
                fieldsets : {legend : 'Filtro'}
            }),
            browse = new Element('tool-list-browse', 'div'),
            count = new Element('tool-list-browse-count', 'div'),
            results = new Element('tool-list-browse-results', 'div'),
            ol = new Element(undefined, 'ol'),
            countSpan = new Element(undefined, 'span'),
            countLegend = new Element(undefined, 'span'),
            total = 0;

        element.childs.add(div);
        div.childs.add([filter, browse]);
        filter.childs.add([imageFilter, filterForm]);
        browse.childs.add([count, results]);
        results.childs.add(ol);
        count.childs.add([countSpan, countLegend]);

        countSpan.value('0');
        countSpan.attributes.add({name : 'class', value : 'count'});
        countLegend.value(' resultados encontrados');
        countLegend.attributes.add({name : 'class', value : 'legend'});


        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Filtro dos resultados */
        this.filter = {
            get : filterForm.fieldsets.get()[0].inputs.get,
            remove : filterForm.fieldsets.get()[0].inputs.remove,
            add : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        /* Se for um array inserir cada um dos elementos */
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else if (obj.constructor === Input) {
                        /* Objeto já construido simplesmente adiciona-o */
                        filterForm.fieldsets.get()[0].inputs.add(obj);
                    } else {
                        /* Cria input */
                        filterForm.fieldsets.get()[0].inputs.add(new Input(obj));
                    }
                }
            },
            submit : filterForm.submit
        };

        /* Barra de elementos encontrados */
        this.browse = {
            get    : ol.childs.get,
            remove : function (ids) {
                total-= ids.length;
                ol.childs.remove(ids);
                countSpan.value(total.toString());
            },
            add    : function (obj) {
                var i;

                if (obj) {
                    if (obj.constructor === Array) {
                        for (i = 0; i < obj.length; i++) {
                            this.add(obj[i]);
                        }
                    } else {
                        total++;
                        ol.childs.add(new browseOption(obj));
                        countSpan.value(total.toString());
                    }
                }
            }
        };
    };

    /** Frame
     *
     * @autor : Rafael Erthal
     * @since : 2012-08
     *
     * @description : implmenta a janela principal da UI
     */
    Frame = function () {
        var element = new Element(undefined, 'section'),
            div = new Element('tool-frame', 'div'),
            navigation = new Element('tool-frame-navigation', 'menu'),
            view = new Element('tool-frame-view', 'div'),
            header = new Element(undefined, 'header'),
            headerDiv = new Element('tool-frame-view-header', 'div'),
            thumbnail = new Element('tool-frame-view-header-thumbnail', 'div'),
            title = new Heading({type : '3', id : 'tool-frame-view-header-title'}),
            subtitle = new Heading({type : '3', id : 'tool-frame-view-header-subtitle'}),
            actions = new Element('tool-frame-view-header-actions', 'menu'),
            headerSpacer = new Element(undefined, 'div'),
            tabs = new Element(undefined, 'nav'),
            tabsMenu = new Element('tool-frame-view-tabs', 'menu'),
            tabsSpacer = new Element(undefined, 'div'),
            content = new Element(undefined, 'section'),
            contentDiv = new Element('tool-frame-view-content', 'div');


        element.childs.add(div);
        div.childs.add([navigation,view]);
        view.childs.add([header, tabs, content]);
        header.childs.add([headerDiv, headerSpacer]);
        headerDiv.childs.add([thumbnail, title, subtitle, actions]);
        tabs.childs.add([tabsMenu, tabsSpacer]);
        content.childs.add(contentDiv);

        headerSpacer.attributes.add({name : 'class', value : 'break'});
        tabsSpacer.attributes.add({name : 'class', value : 'break'});

        /* Publicando métodos privados */
        this.add = element.add;
        this.remove = element.remove;

        /* Cabeçalho do frame */
        this.head = {
            title    : title.value,
            subtitle : subtitle.value
        };
        /* Abas */
        this.tabs = {
            get : tabsMenu.childs.get,
            remove : function () {
                contentDiv.value(' ');
                tabsMenu.childs.remove()
            },
            add : function (params) {
                tabsMenu.childs.add(new tabOption(params, contentDiv));
            }
        };
    };

    /* Montando o namespace da UI */

    /* Objetos do namespace */
    this.menu = new Menu();
    this.list = new List();
    this.frame = new Frame();

    /* Construtores */
    this.img = Image;
    this.a = Anchor;
    this.b = Strong;
    this.i = Italic;
    this.p = Paragraph;
    this.h = Heading;
    this.div = Div;
    this.form = Form;
    this.fieldset = Fieldset;
    this.input = Input;
    this.span = Span;

    /* Elementos intermediários da interface */
    var section = new Element(undefined, 'section'),
        toolcontent = new Element('tool-content', 'div'),
        header = new Element(undefined, 'header'),
        toolHeader = new Element('tool-header', 'div'),
        toolName = new Element('tool-name', 'h2');

    section.childs.add(toolcontent);
    toolcontent.childs.add([this.list, this.frame]);

    header.childs.add(toolHeader);
    toolHeader.childs.add(toolName);

    /* Montando interface */
    header.add(document.getElementById('tool'));
    this.menu.add(document.getElementById('tool'));
    section.add(document.getElementById('tool'));
};