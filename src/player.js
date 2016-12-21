const {BrowserWindow, ipcMain} = require('electron')

let win

module.exports = {
  open(parent) {
    win = new BrowserWindow({
      width: 0,
      height: 0,
      skipTaskbar: true,
      parent
    })
    win.loadURL('file://' + global.appRoot + '/views/player.html')
    console.log('Hiding Player window')
    win.hide()

    ipcMain.on('player', (event, args) => {
      const command = args.shift()
      win.webContents.send(command, args)
    })

    // Erase self when closing window.
    win.on('closed', () => {
      win = null
    })
  },
  isOpen() {
    const isOpen = (typeof win !== 'undefined')
    console.log('Is player open? ' + (isOpen ? 'It is.' : 'It\'s not.'))
    return isOpen
  }
}
