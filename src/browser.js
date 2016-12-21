const {BrowserWindow, Menu, ipcMain} = require('electron')
const library = require('./library')
const player = require('./player')

let win
function open() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: 'assets/icon-small.png'
  })
  player.open(win)
  win.loadURL('file://' + global.views.browser)
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

  ipcMain.on('player-state', (event, args) => {
    if(isOpen()) win.webContents.send('player-state', args)
  })
  // win.webContents.openDevTools()
  // Erase self when closing window.
  win.on('closed', () => {
    win = null
  })
}

function isOpen() {
  return ((typeof win !== 'undefined') && (win !== null))
}
module.exports = {
  open,
  isOpen
}
