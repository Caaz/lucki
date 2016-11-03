const fs = require('fs');
const glob = require("glob");
const ID3 = require('id3-parser');
const {ipcMain} = require('electron')
let library;
function readFiles(files, sender) {
  let file = files.shift();
  if(file) {
    sender.send('status', 'Reading '+file);
    let data = fs.readFileSync(file);
    ID3.parse(data).then((tag) => {
      tag.location = file;
      if(tag.title == '') {
        let fparts = file.split('/');
        let title = fparts[fparts.length-1].split('.');
        title.pop();
        tag.title = title.join('.');
      }
      if (!(!tag.title && !tag.artist && !tag.album)) { library[file] = tag; }
      readFiles(files,sender);
    });
  } else {
    sender.send('status', 'Library Updated');
    saveLibrary()
    sender.send('library', library);
    return;
  }
}
ipcMain.on('library', (event, arg) => {
  if(arg == 'get') {
    if(!library) {
      if(readLibraryCache()) { event.sender.send('library', library); }
      else {
        console.log("No cache exists. Updating library instead.")
        updateLibrary(event.sender);
      }
    }
  }
  else if(arg == 'update') { updateLibrary(event.sender) }
})
function updateLibrary(sender) {
  sender.send('status', 'Updating Library');
  library = {};
  glob(process.env.HOME+"/Music/**/*.mp3", function (err, files) {
    if(err) console.log(err);
    else readFiles(files, sender);
  });
}
function readLibraryCache() {
  let cache = process.env.HOME+'/.lucki/library_cache.json'
  if(fs.existsSync(cache)) {
    console.log("Reading library cache.")
    let data = fs.readFileSync(cache)
    library = JSON.parse(data)
    return true;
  }
  return false;
}
function saveLibrary() {
  console.log("Saving library cache.")
  let cache = process.env.HOME+'/.lucki/library_cache.json'
  fs.writeFileSync(cache,JSON.stringify(library))
}
