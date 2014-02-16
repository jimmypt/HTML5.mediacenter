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


// namespacing para encapsular as funcionalidades da base de dados
var wt_mediacenter = {};
wt_mediacenter.indexedDB = {};

// criar atributo para guardar uma referêcia para a bd
wt_mediacenter.indexedDB.db = null;
// abrir a base de dados
wt_mediacenter.indexedDB.open = function() {

    // versão da bd
    var version = 1;
    // abrir a bd com nome shoppinglist
    var request = indexedDB.open("wt_movies", version);

    // esta callback é a única que pode alterar a esturuta da base de dados
    // permitem criar "Object Stores" e criar ou remover índices
    // caso queiramos alterar a estrutura da base e dados temos que alterar a "version"
    request.onupgradeneeded = function(event) {
        var db = event.target.result;

        debugger;

        // uma transação do tipo "versionchange" é iniciada automaticamente
        event.target.transaction.onerror = wt_mediacenter.indexedDB.onerror;

        if (db.objectStoreNames.contains("movie")) {
            db.deleteObjectStore("movie");
        }

        // Criar uma Object Store chamada "movie"
        // segundo parâmetro permite configurar opções da base de dados
        // o keyPath define a propriedade que será única e identifica inequivocamente cada item
        var objStore = db.createObjectStore("movie",
                {
                    keyPath: "file"
                }
        );
    }
    // callback de sucesso para o pedido que fizemos
    // neste caso o onupgradeneeded
    request.onsuccess = function(event) {
        // o parametro event é o "open" que fizemos acima
        // guardar referencia para a base de dados que abrimos [!]
        wt_mediacenter.indexedDB.db = event.target.result;
        console.log(wt_mediacenter.indexedDB.db);
        // agora que abrimos a base de dados com sucesso, podemos ler o seu conteúdo
        wt_mediacenter.indexedDB.getAllShoppingItems();
    }

    request.onerror = wt_mediacenter.indexedDB.onerror;
}



// como adicionar items à lista
wt_mediacenter.indexedDB.addItem = function(movie) {
    // referência à base de dados
    var db = wt_mediacenter.indexedDB.db;
    if (!db) {
        console.log('BOOUUMMMMM');
    }
    // indicar que vai ser feito um acesso do tipo readwrite (leitura e escrita)
    var transaction = db.transaction(["movie"], "readwrite");
    // referência à objectStore
    var objStore = transaction.objectStore("movie");
    // datahora atual
    var now = new Date().getTime();
    // pedido do tipo "put" para introduzir um novo item
    var request = objStore.put(movie);

    // callback de sucesso ao request do tipo put que fizemos
    request.onsuccess = function(event) {

        wt_mediacenter.indexedDB.getAllShoppingItems();
    }

    request.onerror = wt_mediacenter.indexedDB.onerror;
}

wt_mediacenter.indexedDB.getAllShoppingItems = function() {
    // limpar lista atual
    console.log("GO CENAS");
    // referência local à db
    var db = wt_mediacenter.indexedDB.db;
    // transação de leitura
    var transaction = db.transaction(["movie"], "readwrite");
    // referência para a object store
    var objStore = transaction.objectStore("movie");


    // uma vez que definimos o nosso index (keyPath) como numérico
    // o lowerBound indica que queremos todos os valores acima de 0
    var keysRange = IDBKeyRange.lowerBound(0);
    // referencia ao cursor - iterador que percorrerá toda a lista
    var cursor = objStore.openCursor(keysRange);

    // callback de sucesso
    cursor.onsuccess = function(event) {
        var result = event.target.result;
        // forçar o cast para boleano e verificar se é falso
        if (!!result == false) {
            return;
        }

        // chamar função de renderização de cada item
        console.log(result.value.title);
        renderMovie(result.value);
        // pedir novo item ao cursor
        result.continue();
    }

}

// apagar um item
wt_mediacenter.indexedDB.deleteItem = function(id) {
    var db = wt_mediacenter.indexedDB.db;
    var transaction = db.transaction(["movie"], "readwrite");
    var objStore = transaction.objectStore("movie");

    var request = objStore.delete(id);

    request.onsuccess = function(event) {
        wt_mediacenter.indexedDB.getAllShoppingItems();
    }

    request.onerror = wt_mediacenter.indexedDB.onerror;

}

// error logging
wt_mediacenter.indexedDB.onerror = function(error) {
    console.log(error);
}


// apenas para renderização
var renderMovie = function renderMovie(movie) {
    var movies_list = document.getElementById('movies_list');
    var li = document.createElement('li');
    var title = document.createTextNode(movie.title ? movie.title : movie.file);
    li.appendChild(title);
    movies_list.appendChild(li);
}

window.onload = function() {

    wt_mediacenter.indexedDB.open();
    document.addEventListener('click', function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        console.log("GO CLICK");
        wt_mediacenter.indexedDB.addItem(movie);
        wt_mediacenter.indexedDB.addItem(movie2);
        wt_mediacenter.indexedDB.addItem(movie3);
        wt_mediacenter.indexedDB.addItem(movie4);
    });
}