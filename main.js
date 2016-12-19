const path = require('path')
const fs = require('fs')
const {app, ipcMain} = require('electron')
const mkdirp = require('mkdirp')
const carlin = require('carlin')
const less = require('less')

global.appRoot = path.resolve(__dirname)
global.appData = app.getPath('userData')
mkdirp(global.appRoot + '/tmp/', err => {
  if(err) console.error(err)
})

// Set up views.
carlin.settings({outDir: global.appRoot + '/tmp/', pugOptions: {
  appRoot: global.appRoot,
  appData: global.appData
}})
console.time('Compiling Views')
carlin.compile(global.appRoot + '/views/browser.pug')
console.timeEnd('Compiling Views')
global.views = {
  browser: carlin.get('browser')
}

// Main browser window.
const browser = require('./src/browser')

app.on('ready', () => {
  const theme = global.appRoot + '/themes/Default/'
  const style = theme + 'main.less'
  const content = fs.readFileSync(style).toString()
  less.render(content, {paths: [theme]}).then(output => {
    fs.writeFileSync(global.appData + '/tmp/style.css', output.css)
    browser.open()
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
