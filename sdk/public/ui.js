/*global sdk: false, document: false*/

var Collection = function () {
    var elements = [],
        index;

    index = function (id) {
        var res = null,
            i;

        for (i = 0; i < elements.length; i = i + 1) {
            if (elements[i].id === id) {
                res = elements[i];
            }
        }

        return res;
    }

    this.add = function (element) {
        element.render();
        elements.push(element);
    };

    this.remove = function (id) {
        var i;

        i = index(id);
        if (i) {
            elements.slice(i,1);
        }
    };

    this.get = function (id) {
        var i,
            res;

        if (id) {
            i = index(id);
            if (i) {
                res = elements[i];
            }
        } else {
            res = elements;
        }
        return res;
    };
}

/** Ui
 *
 * @autor : Rafael Erthal
 * @since : 2012-08
 *
 * @description : implementa a biblioteca de interface com o usuário
 */
function Ui (app) {
    this.menu = {
        navigation : new Collection(),
        actions : new Collection()
    };

    this.list = {
        filter : {},
        browse : {
            title : {},
            items : new Collection()
        },
        collapse : function (collapsed) {

        },
        visible : function (visibility) {

        }
    };

    this.frame = {
        head : {
            image : {},
            title : {},
            subtitle : {},
            toolbar : new Collection(),
            buttons : new Collection()
        },
        tabs : new Collection()
    };
}