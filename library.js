const fs = require('fs');
const glob = require("glob");
const ID3 = require('id3-parser');
const {ipcMain} = require('electron')
let library;

ipcMain.on('library', (event, arg) => {
  if(arg == 'get' && (!library) && (!load(event.sender))) update(event.sender);
  else if(arg == 'update') update(event.sender)
})
function load(out) {
  let cache = process.env.HOME+'/.lucki/library_cache.json'
  if(fs.existsSync(cache)) {
    out.send('status', 'Loading library cache')
    let data = fs.readFileSync(cache)
    library = JSON.parse(data)
    out.send('library',library)
    return true;
  }
  return false;
}
function save(out) {
  out.send('status', 'Saving library cache')
  let cache = process.env.HOME+'/.lucki/library_cache.json'
  fs.writeFileSync(cache,JSON.stringify(library))
}
function update(out) {
  out.send('status', 'Updating Library');
  library = {};
  glob(process.env.HOME+"/Music/**/*.mp3", function (err, files) {
    if(err) console.log(err);
    else parseFiles(files, out);
  });
}
function parseFiles(files, out) {
  let file = files.shift()
  if(file) {
    let data = fs.readFileSync(file)
    ID3.parse(data).then((tag) => {
      tag.location = file
      if(tag.title == '') {
        let fparts = file.split('/')
        let title = fparts[fparts.length-1].split('.')
        title.pop()
        tag.title = title.join('.')
      }
      if (!(!tag.title && !tag.artist && !tag.album)) { library[file] = tag }
      readFiles(files,out)
    })
  } else {
    out.send('status', 'Library updated')
    out.send('library', library)
    save(out)
  }
}
module.exports = {
  update: update,
};
