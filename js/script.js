//if (!supports_video()) { alert('Sorry, your browser does support video.\nBe reasonable and use Google Chrome.'); }
var player = document.getElementById('video');
var movies = JSON.parse(localStorage.getItem('movies'));
if(!movies){ movies = new Array(); }
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
        case 112:  /* p */
            changeContent('player');
            break;
        case 113:  /* q */
            document.getElementById("help").style.visibility = "hidden";
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
    /* Have to pass this to my fw - or try harder... */
    var els = document.getElementsByClassName('content');
    for (var i = 0; i < els.length; i++) {
        els[i].className = els[i].className.replace('active', '');
    }
    _wt(page).addClass('active');
}

function addToTable(files) {
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        addMovieToStorage(f);
//        var movies = JSON.parse(localStorage.getItem('movies'));
//        console.log(movies);
//        if (movies) {
//            for (var i = 0; i < movies.length; i++) {
//                
//            }
//        }
//        console.log(JSON.stringify(f));
        //document.getElementById('video').innerHTML = '<source src="https://ia700408.us.archive.org/26/items/BigBuckBunny_328/BigBuckBunny_512kb.mp4" type="video/mp4">';
        output.push('<tr class="line"><td>', escape(f.name), '</td><td>', f.type || 'n/a', '</td><td>',
                f.size, ' bytes</td><td>',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</td></tr>');
    }
    document.getElementById('list').getElementsByTagName('tbody')[0].innerHTML = output.join('');
}
function addMovieToStorage(file){
    console.log('Start add movies')
    if(!movies){
        console.log('no movies');
        movies = JSON.parse(localStorage.getItem('movies'));
    }
//    for (var i = 0; i < movies.length; i++) {
//        
//    }
    movies.push(JSON.stringify(file));
    localStorage.setItem('movies', JSON.stringify(movies));
    console.log(movies)
    console.log('End add movies')
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