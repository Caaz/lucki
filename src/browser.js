const {BrowserWindow,Menu} = require('electron');
// Library management.
const library = require('./library')

let browser
function isOpen() { return (browser != null); }
function open () {
  // TODO: Save these values in config.
  browser = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true
  })
  browser.loadURL('file://'+global.appRoot+'/app/render.html')
  // The length of this pains me.
  browser.setMenu(Menu.buildFromTemplate([
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
  browser.on('closed', function () { browser = null })
}
module.exports = {
  open: open,
  isOpen: isOpen
}
