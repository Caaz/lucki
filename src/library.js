const fs = require('fs')
const glob = require("glob")
const ID3 = require('id3-parser')
const {ipcMain} = require('electron')
const cache = process.env.HOME+'/.lucki/library_cache_new.json'

let library = false;

ipcMain.on('library', (event, arg) => {
  let output = event.sender;
  switch(arg) {
    case 'get':
      if(library) { output.send('library',library); break }
      else if(load(output)) { break; }
    case 'update':
      update(output);
      break;
  }
})

function load(out) {
  if(fs.existsSync(cache)) {
    console.log('Loading library cache');
    let data = fs.readFileSync(cache);
    library = JSON.parse(data);
    console.log('Library cache loaded');
    out.send('library',library);
    return true;
  }
  return false;
}
function save(out) {
  console.log('Saving library cache');
  fs.writeFileSync(cache,JSON.stringify(library));
}
function update(out) {
  console.log("Updating Library");
  library = {};
  glob(process.env.HOME+"/Music/**/*.mp3", function (err, files) {
    if(err) console.log(err);
    else parseFiles(files, out);
  });
}
function parseFiles(files, out) {
  let file = files.shift();
  if(file) {
    // console.log("Reading "+file);
    let data = fs.readFileSync(file)
    ID3.parse(data).then((tag) => {
      tag.location = file;
      if(tag.title == '') {
        let fparts = file.split('/');
        let title = fparts[fparts.length-1].split('.');
        title.pop();
        tag.title = title.join('.');
      }
      if (!(!tag.title && !tag.artist && !tag.album)) { library[hash(file)] = tag; }
      parseFiles(files,out);
    })
  } else {
    console.log('Library Updated');
    out.send('library', library);
    save(out);
  }
}

// * Calculate a 32 bit FNV-1a hash
// * Found here: https://gist.github.com/vaiorabbit/5657561
// * Modified
function hash(str, seed) {
  var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;
  for (i = 0, l = str.length; i < l; i++) {
    hval ^= str.charCodeAt(i);
    hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
}

module.exports = {
  update: update,
}
