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
  addToTable(evt.target.files);
}
function handleFileDrop(evt) {
  evt.stopPropagation();     
  evt.preventDefault();

  addToTable(evt.dataTransfer.files);
}
function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy';
}