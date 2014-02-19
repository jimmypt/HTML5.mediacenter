function _wt(id) {

    // About object is returned if there is no 'id' parameter
    this.about = {
        version: 0.1,
        author: "Walter Tavares",
        created: "February 2014",
        updated: "February 2014",
        inspired_by: "http://www.mikedoesweb.com/2012/creating-your-own-javascript-library/"
    };

    if (id) {
        if (window === this) {
            return new _wt(id);
        }
//        if (id.substring(0, 1) === '.') {
//            this.e = document.getElementsByClassName(id.replace('.', ''));
//        } else {
        this.e = document.getElementById(id);
//        }
//        console.log(this.e);
//        console.log(typeof this.e);
        return this;
    } else {
        return about;
    }
}
;

_wt.prototype = {
    addClass: function(class_name) {
        if (this.e.className.indexOf(class_name) === -1) {
            this.e.className += ' ' + class_name;
        }
        return this;
    },
    hide: function() {
//        if (this.e) {
        this.e.style.display = 'none';
//        } else {

//        }
        return this;
    },
    html: function() {
        if (arguments.length === 0) {
            return this.e.innerHTML;
        }
        this.e.innerHTML = arguments[0];
        return this;
    },
    removeClass: function(class_name) {
        this.e.className = this.e.className.replace(class_name, '');
        return this;
    },
    show: function() {
        this.e.style.display = 'block';
        return this;
    }
};
