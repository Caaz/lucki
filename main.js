const electron = require('electron')
const {ipcMain} = require('electron') // Figure out why the syntax is like this.
const fs = require('fs');
const glob = require("glob");
const ID3 = require('id3-parser');
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})
  // Load up the contents.
  // mainWindow.setMenu(null);
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  // Erase self when closing window.
  mainWindow.on('closed', function () { mainWindow = null })
}
app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) createWindow()
})



function readFiles(files, sender) {
  let file = files.shift();
  if(!file) {
    sender.send('status', 'Library read');
    return;
  }
  else {
    sender.send('status', 'Reading '+file);
    let data = fs.readFileSync(file);
    ID3.parse(data).then((tag) => {
      tag.location = file;
      if(tag.title == '') {
        let fparts = file.split('/');
        tag.title = fparts[fparts.length-1].split('.')[0];
      }
      sender.send('add', tag);
      readFiles(files,sender);
    });
  }
}
ipcMain.on('library', (event, arg) => {
  if(arg == 'get') {
    event.sender.send('status', 'Retrieving Library');
    glob("/home/caaz/Music/Panda/**/*.mp3", function (err, files) {
      if(err) { console.log(err); }
      else { readFiles(files, event.sender); }
    });
  }
})
