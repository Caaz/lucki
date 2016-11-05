const {app} = require('electron');
const mkdirp = require('mkdirp');
const path = require('path');

global.appRoot = path.resolve(__dirname);

// Main browser window.
const browser = require('./src/browser');
// const config = require('./src/config');

// Make configuration folder.
mkdirp(process.env.HOME+'/.lucki/', (err) => { if (err) console.error(err) });

// Open browser window when the app is ready!
app.on('ready', function(){
  browser.open()
  // config.open()
});
// Open it when it's clicked on the dock if it wasn't open already (OSX)
app.on('activate', function () { if (!browser.isOpen) browser.open(); });
// If all windows are closed, close the app. Eventually disable this line, we never wanna quit when the browsser window is closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})
