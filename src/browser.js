const {BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron')
const library = require('./library')
const player = require('./player')

let win
function open() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    icon: 'assets/icon.png'
  })
  const playerWindow = player.open(win)
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
        },
        {
          label: 'Show Visualizer',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+v' : 'Ctrl+Shift+v',
          click(item, focusedWindow) {
            playerWindow.show()
            // if(focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        }
      ]
    }
  ]))
  const mediaKeys = [
    ['MediaNextTrack', 'next'],
    ['MediaPreviousTrack', 'previous'],
    ['MediaPlayPause', 'playToggle'],
    ['MediaStop', 'stop']
  ]
  // Listen for media keys
  for(const i in mediaKeys) {
    globalShortcut.register(mediaKeys[i][0], () => {
      win.webContents.send(mediaKeys[i][1])
    })
  }

  // Pass notification-action and player-state to the view.
  const passthrough = ['player-state']
  for(const i in passthrough) {
    ipcMain.on(passthrough[i], (event, args) => {
      if(isOpen()) win.webContents.send(passthrough[i], args)
    })
  }

  // win.webContents.openDevTools()
  // Erase self when closing window.
  win.on('closed', () => {
    win = null
    playerWindow.destroy()
  })
}

function isOpen() {
  return ((typeof win !== 'undefined') && (win !== null))
}
module.exports = {
  open,
  isOpen
}
