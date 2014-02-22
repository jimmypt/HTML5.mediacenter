//if (!supports_video()) { alert('Sorry, your browser does support video.\nBe reasonable and use Google Chrome.'); }
var player = document.getElementById('video');
var movies = JSON.parse(localStorage.getItem('movies'));
var hack_movie_files = {};
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
        case 42:  /* * */
            doVolumeOff();
            break;
        case 43:  /* + */
            if (player.volume.toFixed(1) < 1.0) {
                player.volume += 0.1;
            }
            break;
        case 45:  /* - */
            doVolumeDown();
            break;
        case  63: /* ? */
            document.getElementById("help").style.visibility = "visible";
            break;
        case 102:  /* f */
            doFullscreen();
            break;
        case 108: /* l */
            changeContent('load');
            break;
        case 109: /* m */
            changeContent('movies');
            refreshMoviesList();
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

var doPlay = function doPlay() {
    if (player.src != '') {
        _wt('header').hide();
        _wt('controls').hide();
        player.play();
    }
};
var doPause = function doPause() {
    _wt('header').show();
    _wt('controls').show();
    player.pause();
};
var doStop = function doStop() {
    _wt('header').show();
    _wt('controls').show();
    player.pause();
    player.currentTime = 0;
};
var doFullscreen = function doFullscreen() {
    if (player.requestFullscreen) {
        player.requestFullscreen();
    } else if (player.mozRequestFullScreen) {
        player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) {
        player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) {
        player.msRequestFullscreen();
    }
};
var doVolumeOff = function doVolumeOff() {
    player.volume = 0;
};
var doVolumeDown = function doVolumeDown() {
    if (player.volume.toFixed(1) > 0.0) {
        player.volume -= 0.1;
    }
};
var doVolumeUp = function doVolumeUp() {
    if (player.volume.toFixed(1) > 0.0) {
        player.volume -= 0.1;
    }
};


function Xhr() {
    return  new XMLHttpRequest() ||
            new ActiveXObject("Msxml3.XMLHTTP") ||
            new ActiveXObject("Msxml2.XMLHTTP.6.0") ||
            new ActiveXObject("Msxml2.XMLHTTP.3.0") ||
            new ActiveXObject("Msxml2.XMLHTTP") ||
            new ActiveXObject("Microsoft.XMLHTTP") ||
            null;
}

function changeContent(page) {
    var els = document.getElementsByClassName('content');
    for (var i = 0; i < els.length; i++) {
        els[i].className = els[i].className.replace('active', '');
    }
    _wt(page).addClass('active');
}

function addToTable(files) {
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        var movie = {
            title: f.name.replace(/\./g, ' '),
            file: f.name,
            type: f.type,
            size: f.size,
//            data: JSON.stringify(f),
            url: URL.createObjectURL(f)
        };
        hack_movie_files[f.name] = f;
        wt_mediacenter.indexedDB.addMovie(movie);
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
var renderAllMovies = function renderAllMovies() {
    var movies = wt_mediacenter.indexedDB.getAllMovies();
    var keysRange = IDBKeyRange.lowerBound(0);

    var cursor = movies.openCursor(keysRange);

    resetMoviesList();
    cursor.onsuccess = function(event) {
        var result = event.target.result;
        if (!!result == false) {
            return;
        }
        renderMovie(result.value);
        result.continue();
    };
};
var renderMovie = function renderMovie(movie) {
    var movies_list = document.getElementById('movies_list');

    var li = document.createElement('li');
    li.className = 'movie';
    li.setAttribute('onclick', 'loadVideo("' + movie.file + '")');

    var img = document.createElement('img');
    img.setAttribute('src', '/image.php?url=' + movie.poster);
    li.appendChild(img);

    var title = document.createTextNode(movie.title ? movie.title : movie.file);
    var span = document.createElement('span');
    span.appendChild(title);
    li.appendChild(span);

    var a = document.createElement('a');
    a.className = 'delete icon-trash';
    a.setAttribute('onclick', 'deleteMovie("' + movie.file + '")');
    li.appendChild(a);

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
    var playable = video.canPlayType(movie.type);
    var playable = document.createTextNode(playable === '' ? 'Format not suported' : playable);
    td.appendChild(playable);
    tr.appendChild(td);

    movies_list.appendChild(tr);
};
var refreshMoviesList = function refreshMoviesList() {
    var movies = wt_mediacenter.indexedDB.getAllMovies();
    var keysRange = IDBKeyRange.lowerBound(0);

    var cursor = movies.openCursor(keysRange);

    resetMoviesList();
    cursor.onsuccess = function(event) {
        var result = event.target.result;
        if (!!result == false) {
            return;
        }
        var movie = result.value;
        if (!movie.title) {
            movie.title = movieSanitizeTitle(movie.file);
        }

        setTimeout(movieGetImdbData(movie), 5000);

        wt_mediacenter.indexedDB.addMovie(movie);
        renderMovie(movie);
        result.continue();
    };

};

var movieGetImdbData = function movieGetImdbData(movie) {
    var stay = true;
    i = 1;
    var title = movie.title;
    while (stay) {
        var xhr = new Xhr();
        xhr.open('GET', 'http://www.omdbapi.com/?t=' + title, false);
        xhr.send();
        var response = JSON.parse(xhr.response);
        if (response.Response === 'True') {
            stay = false;
            movie.title = response.Title;
            movie.poster = response.Poster;
        }

        var pos = title.lastIndexOf(' ');
        title = title.substr(0, pos);
        stay = pos < 0 ? false : stay;
    }
    return movie;
}
var movieSanitizeTitle = function movieSanitizeTitle(title) {
    return title.replace(/[\.\_]/g, ' ');
};

var loadVideo = function loadVideo(filename) {
    wt_mediacenter.indexedDB.findMovie(filename);
    player.src = URL.createObjectURL(hack_movie_files[filename]);
    changeContent('player');
    doPlay();
};

var deleteMovie = function deleteMovie(id) {
    wt_mediacenter.indexedDB.deleteMovie(id);
};
