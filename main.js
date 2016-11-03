require('require-rebuild')();
const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const mkdirp = require('mkdirp')

const path = require('path')
const url = require('url')


// Library management.
const library = require('./library')


// Make configuration folder.
mkdirp(process.env.HOME+'/.lucki/', (err) => { if (err) console.error(err) })



let mainWindow
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600,autoHideMenuBar:true})
  // Load up the contents.
  // mainWindow.setMenu(null)
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/render.html'),
    protocol: 'file:',
    slashes: true
  }))


  mainWindow.setMenu(Menu.buildFromTemplate([
    {
      label:'Library',
      submenu: [
        {
          label:'Update',
          click (i,w,e) { library.update(w) }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
      ]
    }
  ]))
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
