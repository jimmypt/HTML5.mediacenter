function _wt(id) {

    // About object is returned if there is no 'id' parameter
    this.about = {
        version: 0.1,
        author: "Walter Tavares",
        created: "February 2014",
        updated: "02 February 2014",
        inspired_by: "http://www.mikedoesweb.com/2012/creating-your-own-javascript-library/"
    };

    if (id) {
        if (window === this) {
            return new _wt(id);
        }
        this.e = document.getElementById(id);
        return this;
    } else {
        return about;
    }
}
;

_wt.prototype = {
    hide: function() {
        this.e.style.display = 'none';
        return this;
    },
    addClass: function(class_name) {
        if (this.e.className.indexOf(class_name) === -1) {
            this.e.className += ' ' + class_name;
        }
        return this;
    },
    removeClass: function(class_name) {
        this.e.className = this.e.className.replace(class_name, '');
        return this;
    }
};
