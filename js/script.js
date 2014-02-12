//if (!supports_video()) { alert('Sorry, your browser does support video.\nBe reasonable and use Google Chrome.'); }
var player = document.getElementById('video');
document.addEventListener('keypress', function(evt) {
    switch (evt.keyCode) {
        case 32:  /* [space] */
            if (player.paused) {
                doPlay();
            } else {
                doPause();
            }
            break;
        case 43:  /* + */
            if (player.volume.toFixed(1) < 1.0) {
                player.volume += 0.1;
            }
            break;
        case 45:  /* - */
            if (player.volume.toFixed(1) > 0.0) {
                player.volume -= 0.1;
            }
            break;
        case  63: /* ? */
            document.getElementById("help").style.visibility = "visible";
            break;
        case 102:  /* f */
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.mozRequestFullScreen) {
                player.mozRequestFullScreen();
            } else if (player.webkitRequestFullscreen) {
                player.webkitRequestFullscreen();
            } else if (player.msRequestFullscreen) {
                player.msRequestFullscreen();
            }
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
        case 118:  /* v */
            changeContent('video');
            break;
        default:
            console.log("keyCode " + evt.keyCode + " not configured.");
            break;
    }
});

function doPlay() {
    document.getElementsByTagName('header')[0].style.display = 'none';
    player.play();
}

function doPause() {
    document.getElementsByTagName('header')[0].style.display = 'inline-block';
    player.pause();
}

function Xhr() {
//    try{return new XMLHttpRequest();}catch(e){}try{return new ActiveXObject("Msxml3.XMLHTTP");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}catch(e){}try{return new ActiveXObject("Msxml2.XMLHTTP");}catch(e){}try{return new ActiveXObject("Microsoft.XMLHTTP");}catch(e){}return null;
    return  new XMLHttpRequest() ||
            new ActiveXObject("Msxml3.XMLHTTP") ||
            new ActiveXObject("Msxml2.XMLHTTP.6.0") ||
            new ActiveXObject("Msxml2.XMLHTTP.3.0") ||
            new ActiveXObject("Msxml2.XMLHTTP") ||
            new ActiveXObject("Microsoft.XMLHTTP") ||
            null;
}

function changeContent(page) {
    location.href = "#" + page;
}

function addToTable(files) {
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        console.log(f);
        output.push('<tr class="line"><td>', escape(f.name), '</td><td>', f.type || 'n/a', '</td><td>',
                f.size, ' bytes</td><td>',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</td></tr>');
    }
    document.getElementById('list').getElementsByTagName('tbody')[0].innerHTML = output.join('');
}
function handleFileSelect(evt) {
    addToTable(evt.target.files);
}
function handleFileDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    _wt(evt.target.getAttribute('id')).removeClass('dragover');
    addToTable(evt.dataTransfer.files);
}
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    _wt(evt.target.getAttribute('id')).addClass('dragover');
    evt.dataTransfer.dropEffect = 'copy';
}