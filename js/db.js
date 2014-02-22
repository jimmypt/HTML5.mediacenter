var wt_mediacenter = {};
wt_mediacenter.indexedDB = {};

wt_mediacenter.indexedDB.db = null;
wt_mediacenter.indexedDB.open = function() {

    var version = 2;
    var request = indexedDB.open("wt_movies", version);

    request.onupgradeneeded = function(event) {
        var db = event.target.result;
        event.target.transaction.onerror = wt_mediacenter.indexedDB.onerror;

        if (db.objectStoreNames.contains("movie")) {
            db.deleteObjectStore("movie");
        }

        db.createObjectStore("movie", {keyPath: "file"});
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

    request.onerror = wt_mediacenter.indexedDB.onerror;
};

wt_mediacenter.indexedDB.getAllMovies = function() {
    var db = wt_mediacenter.indexedDB.db;
    var transaction = db.transaction(["movie"], "readwrite");
    return transaction.objectStore("movie");
};

wt_mediacenter.indexedDB.findMovie = function(id) {
    var movies = wt_mediacenter.indexedDB.getAllMovies();
    var keysRange = IDBKeyRange.lowerBound(0);

    var cursor = movies.openCursor(keysRange);

    var cenas = null;

    cursor.onsuccess = function(event) {
        var result = event.target.result;
        if (!!result == false) {
            return;
        }
        if (result.key === id) {
//            return result.value;
//            cenas = JSON.parse(result.value.data);
//            var file = JSON.parse(result.value.data);
//            console.log(file);
//            var url = URL.createObjectURL(file);
//            document.getElementById('video').src = 'http://l.html5.wt.pt/8ac4cac3-3350-40a4-8e1d-075d36d8433f';

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
    console.log('Oh god, I think the whole world is burning!');
    console.log(error);
};

window.onload = function() {
    wt_mediacenter.indexedDB.open();
};