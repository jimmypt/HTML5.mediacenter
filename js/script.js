//if (!supports_video()) { alert('Sorry, your browser does support video.\nBe reasonable and use Google Chrome.'); }
var player = document.getElementById('video');
var movies = JSON.parse(localStorage.getItem('movies'));
if (!movies) {
    movies = new Array();
}
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
        console.log(f);
        var movie = {
            title: f.name.replace(/\./g, ' '),
            file: f.name,
            type: f.type,
            size: f.syze
        };
        wt_mediacenter.indexedDB.addItem(movie);
        renderLoadedMovie(movie);
    }
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

/* RENDER MOVIES LISTS */
var resetMoviesList = function resetMoviesList() {
    _wt('movies_list').html('');
};
var renderMovie = function renderMovie(movie) {
    var movies_list = document.getElementById('movies_list');
    var li = document.createElement('li');
    var title = document.createTextNode(movie.title ? movie.title : movie.file);
    li.appendChild(title);
    movies_list.appendChild(li);
};
var renderLoadedMovie = function renderLoadedMovie(movie) {
    var movies_list = document.getElementById('loaded_list');
    var tr = document.createElement('tr');
    tr.className = 'line';

    /* Title */
    var td = document.createElement('td');
    var title = document.createTextNode(movie.title ? movie.title : movie.file);
    td.appendChild(title);
    tr.appendChild(td);

    /* type */
    td = document.createElement('td');
    var type = document.createTextNode(movie.type);
    td.appendChild(type);
    tr.appendChild(td);

    /* Playable */
    td = document.createElement('td');
    var video = document.querySelector('video');
    console.log(video);
    var playable = video.canPlayType(movie.type);
    var playable = document.createTextNode(playable === '' ? 'Format not suported' : playable);
    td.appendChild(playable);
    tr.appendChild(td);

    movies_list.appendChild(tr);
};
var refreshMoviesList = function refreshMoviesList() {
    alert('Do the refresh Movies list!!!!!!');

}
var showLoading = function showLoading() {
    
}
var hideLoading = function hideLoading() {

}