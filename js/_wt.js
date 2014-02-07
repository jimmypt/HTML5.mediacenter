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
      if (window === this) {
         return new _wt();
      }
      this.e = document;
      return this;
   }
};

_wt.prototype = {
   ajax: function(data){
      var xhr = new Xhr();
      xhr.open(data.method, data.url, true);
      xhr.send();
      xhr.onload = function(a) {
         console.log(a)
         _wt.e.innerHTML = this.response;
      }
      console.log(this);
      return this;
   }
};
