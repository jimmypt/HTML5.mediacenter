var movie = {
    title: "Title Movie",
    year: "6546",
    file: "my.movie.file.mp4",
    type: "video/mp4"
};
var movie2 = {
    title: "Another Movie",
    year: "2014",
    file: "another.movie.file.mp4",
    type: "video/mp4"
};
var movie3 = {
    title: "Last Movie",
    year: "1234",
    file: "last.movie.file.mp4",
    type: "video/mp4"
};
var movie4 = {
    title: "Shitty Movie",
    year: "1234",
    file: "shitty.movie.file.mp4",
    type: "video/mp4"
};


var wt_mediacenter = {};
wt_mediacenter.indexedDB = {};

wt_mediacenter.indexedDB.db = null;
wt_mediacenter.indexedDB.open = function() {

    var version = 1;
    var request = indexedDB.open("wt_movies", version);

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        event.target.transaction.onerror = wt_mediacenter.indexedDB.onerror;

        if (db.objectStoreNames.contains("movie")) {
            db.deleteObjectStore("movie");
        }

        var objStore = db.createObjectStore("movie", {keyPath: "file"});
    };

    request.onsuccess = function(event) {
        wt_mediacenter.indexedDB.db = event.target.result;
        renderAllMovies();
    };

    request.onerror = wt_mediacenter.indexedDB.onerror;
};

wt_mediacenter.indexedDB.addMovie = function(movie) {
    var db = wt_mediacenter.indexedDB.db;
    var transaction = db.transaction(["movie"], "readwrite");
    var objStore = transaction.objectStore("movie");
    var request = objStore.put(movie);

    request.onsuccess = function(event) {
        renderAllMovies();
    };

    request.onerror = wt_mediacenter.indexedDB.onerror;
};

wt_mediacenter.indexedDB.getAllMovies = function() {
    var db = wt_mediacenter.indexedDB.db;
    var transaction = db.transaction(["movie"], "readwrite");
    return transaction.objectStore("movie");
};

wt_mediacenter.indexedDB.findMovie = function(id) {
    console.log("Searching for " + id);
    var movies = wt_mediacenter.indexedDB.getAllMovies();
    var keysRange = IDBKeyRange.lowerBound(0);

    var cursor = movies.openCursor(keysRange);

    cursor.onsuccess = function(event) {
        var result = event.target.result;
        if (!!result == false) {
            return;
        }
        console.log("Result key is " + result.key);
        if (result.key === id) {
            var file = JSON.parse(result.value.data);
            console.log(file);
            var url = URL.createObjectURL(file);
            document.getElementById('video').src = url;
            return;
        }
        result.continue();
    };
};
wt_mediacenter.indexedDB.deleteMovie = function(id) {
    var db = wt_mediacenter.indexedDB.db;
    var transaction = db.transaction(["movie"], "readwrite");
    var objStore = transaction.objectStore("movie");

    var request = objStore.delete(id);

    request.onsuccess = function(event) {
        renderAllMovies();
    };

    request.onerror = wt_mediacenter.indexedDB.onerror;

};

wt_mediacenter.indexedDB.onerror = function(error) {
    console.log(error);
};

window.onload = function() {
    wt_mediacenter.indexedDB.open();
};