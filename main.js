const path = require('path')
const {app, ipcMain} = require('electron')
const mkdirp = require('mkdirp')

global.appRoot = path.resolve(__dirname)

// Make configuration folder.
global.appData = process.env.HOME + '/.lucki/'
mkdirp(global.appData, err => {
  if(err) console.error(err)
})

// Main browser window.
const browser = require('./src/browser')

app.on('ready', () => {
  browser.open()
})
app.on('activate', () => {
  if(!browser.isOpen()) browser.open()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('echo', (event, arg) => {
  console.log(arg)
})
