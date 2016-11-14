const path = require('path')
const {app} = require('electron')
const mkdirp = require('mkdirp')

global.appRoot = path.resolve(__dirname)

// Make configuration folder.
global.appData = process.env.HOME + '/.lucki/'
mkdirp(global.appData, err => {
  if(err) console.error(err)
})

// Main browser window.
const browser = require('./src/browser')

const openTriggers = ['ready', 'activate']
openTriggers.forEach(trigger => {
  app.on(trigger, () => {
    if(!browser.isOpen) browser.open()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
