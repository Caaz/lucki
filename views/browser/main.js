const $ = require('jquery');
const {ipcRenderer} = require('electron');
const {sprintf} = require('sprintf-js');
const config = require(__dirname+'/config.js');


let $library; // Our library jQuery object.
let keys; // Our keys;
let audio // Our audio object

ipcRenderer.on('library', (event, library) => {
  keys = Object.keys(library);
  let newLibrary = '';
  for(var key in library) {
    let track = library[key];
    newLibrary += sprintf(config.TRACK_FORMAT,{key:key,track:track});
  }
  $library.html(newLibrary);
})

function getDataWithParent(target) {
  let data = target.parentNode.dataset;
  for (let key in target.dataset) { data[key] = target[key]; }
  return data;
}
module.exports = {
  ready: () => {
    $library = $('#library');
    ipcRenderer.send('library', 'get');
    let $document = $(document);
    $document.click((e) => {
      let data = getDataWithParent(e.target);
      if(data.selectable) { console.log("This is selectable!"); }
      if(data.libraryKey) { console.log("This is playable: "+data.libraryKey); }
      else if(e.target.id) { console.log("This has an ID of "+e.target.id); }
      // console.log(e.target.parentNode.dataset);
    });
    $document.dblclick((e) => {
      let data = getDataWithParent(e.target);
      if(data.libraryKey) { ipcRenderer.send('play', data.libraryKey); }
    });

  }
}
