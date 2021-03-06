const {BrowserWindow, Menu, ipcMain, globalShortcut} = require('electron')
const electronSettings = require('electron-settings')
const library = require('./library')
const player = require('./player')

let win

electronSettings.observe('browser.hideMenu', e => {
  console.log('Toggled!')
  if(isOpen()) {
    win.setAutoHideMenuBar(e.newValue)
    win.setMenuBarVisibility(!e.newValue)
  }
})

function open() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: electronSettings.getSync('browser.hideMenu'),
    icon: 'assets/icon.png'
  })
  const position = electronSettings.getSync('browser.position')
  const bounds = electronSettings.getSync('browser.bounds')
  if(position) win.setPosition(position[0], position[1])
  if(bounds) win.setBounds(bounds)
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
        {role: 'togglefullscreen'},
        {role: 'toggledevtools'},
        {
          label: 'Show Visualizer',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+v' : 'Alt+V',
          click() { playerWindow.show() }
        },
        {
          label: 'Show Settings',
          accelerator: process.platform === 'darwin' ? 'Command+,' : 'Ctrl+,',
          click(item, focusedWindow) {
            if(focusedWindow) focusedWindow.webContents.send('open-settings')
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
    playerWindow.close()
    playerWindow.destroy()
  })
  win.on('close', () => {
    electronSettings.setSync('browser.position', win.getPosition())
    electronSettings.setSync('browser.bounds', win.getBounds())
  })
}

function isOpen() {
  return ((typeof win !== 'undefined') && (win !== null))
}
module.exports = {
  open,
  isOpen
}
