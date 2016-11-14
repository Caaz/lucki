const {BrowserWindow, Menu} = require('electron')
const library = require('./library')

let win
function isOpen() {
  return (win !== null)
}
function open() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true
  })
  win.loadURL('file://' + global.appRoot + '/views/render.html?view=browser')
  // The length of this pains me.
  win.setMenu(Menu.buildFromTemplate([
    {
      label: 'Library',
      submenu: [
        {
          label: 'Update',
          click(i, w) { library.update(w) }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if(focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    }
  ]))

  win.webContents.openDevTools()
  // Erase self when closing window.
  win.on('closed', () => {
    win = null
  })
}
module.exports = {
  open,
  isOpen
}
