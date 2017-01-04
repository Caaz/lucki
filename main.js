const path = require('path')
const fs = require('fs')
const {app, ipcMain} = require('electron')
const mkdirp = require('mkdirp')
const carlin = require('carlin')
const less = require('less')
const settings = require('electron-settings')

global.appRoot = path.resolve(__dirname)
global.appData = app.getPath('userData')
mkdirp(global.appRoot + '/tmp/', err => {
  if(err) console.error(err)
})
settings.defaults({
  library: {
    directory: process.env.HOME + '/Music',
    subdirectories: true
  },
  player: {
    volume: 1
  }
})
settings.applyDefaults()

// Start webserver. This should probably be under config or something.
// require('./src/webserver')

// Set up views.
carlin.settings({outDir: global.appRoot + '/tmp/', pugOptions: {
  appRoot: global.appRoot,
  appData: global.appData
}})
console.time('Compiling Views')
carlin.compile(global.appRoot + '/views/browser.pug')
carlin.compile(global.appRoot + '/views/webserver.pug')
console.timeEnd('Compiling Views')
global.views = {
  browser: carlin.get('browser'),
  webserver: carlin.get('webserver')
}

// Main browser window.
const browser = require('./src/browser')

app.on('ready', () => {
  const theme = global.appRoot + '/themes/Default/'
  const style = theme + 'main.less'
  const content = fs.readFileSync(style).toString()
  less.render(content, {paths: [theme]}).then(output => {
    fs.writeFileSync(global.appRoot + '/tmp/theme.css', output.css)
    browser.open()
  }, err => {
    console.error(err)
  })
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
