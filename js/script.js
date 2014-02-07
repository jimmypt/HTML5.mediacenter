//if (!supports_video()) { alert('Sorry, your browser does support video.\nBe reasonable and use Google Chrome.'); }
document.addEventListener('keypress', function(evt) { 
  switch(evt.keyCode){
    case  63: /* ? */
      document.getElementById("help").style.visibility = "visible";
      break;
    case 108: /* l */
      changeContent('load');
      break;
    case 109: /* m */
      changeContent('movies');
      break;
    case 113:  /* q */
      document.getElementById("help").style.visibility = "hidden";
      break;
    default:
      console.log("keyCode " + evt.keyCode + " not configured.");
      break;
  }
});

function Xhr(){
//    try{return new XMLHttpRequest();}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}return null;
    return  new XMLHttpRequest() || 
            new ActiveXObject("Msxml3.XMLHTTP") || 
            new ActiveXObject("Msxml2.XMLHTTP.6.0") || 
            new ActiveXObject("Msxml2.XMLHTTP.3.0") || 
            new ActiveXObject("Msxml2.XMLHTTP") ||
            new ActiveXObject("Microsoft.XMLHTTP") || 
            null;
}

function changeContent(page){
  /*
  var xhr = new Xhr();
  xhr.open('GET', page + '.html', true);
  xhr.send();
  xhr.onload = function() {
    document.getElementById('container').innerHTML = this.response;
  }
  */
  alert(page);
}

function addToTable(files){
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    console.log(f);
    output.push('<tr class="line"><td>', escape(f.name), '</td><td>', f.type || 'n/a', '</td><td>',
      f.size, ' bytes</td><td>',
      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
      '</td></tr>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}
function handleFileSelect(evt) {
  alert("SELECT");
  addToTable(evt.target.files);
}
function handleFileDrop(evt) {
  alert("DROP");
  evt.stopPropagation();     
  evt.preventDefault();

  addToTable(evt.dataTransfer.files);
}
function handleDragOver(evt) {
  alert("DRAGOVER");
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}