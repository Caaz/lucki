const {BrowserWindow, ipcMain} = require('electron')

let win
function open() {
  console.log('Opening player.')
  win = new BrowserWindow({
    width: 0,
    height: 0,
    skipTaskbar: true
  })
  win.loadURL('file://' + global.appRoot + '/views/player/layout.html')
  console.log('Hiding Player window')
  win.hide()

  ipcMain.on('player', (event, args) => {
    win.webContents.send(args.shift(), args)
  })

  // Erase self when closing window.
  win.on('closed', () => {
    win = null
  })
}
module.exports = {
  open,
  isOpen() {
    const isOpen = (typeof win !== 'undefined')
    console.log('Is player open? ' + (isOpen ? 'It is.' : 'It\'s not.'))
    return isOpen
  }
}
