const path = require('path')
const {app} = require('electron')
const mkdirp = require('mkdirp')

global.appRoot = path.resolve(__dirname)
global.userSpace = process.env.HOME + '/.lucki/'
// Main browser window.
const browser = require('./src/browser')
// const config = require('./src/config')

// Make configuration folder.
mkdirp(global.userSpace, err => {
  if(err) console.error(err)
})

// Open browser window when the app is ready!
app.on('ready', () => {
  browser.open()
})
// Open it when it's clicked on the dock if it wasn't open already (OSX)
app.on('activate', () => {
  if(!browser.isOpen) browser.open()
})
// If all windows are closed, close the app. Eventually disable this line, we never wanna quit when the browsser window is closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
