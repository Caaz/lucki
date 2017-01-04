const {BrowserWindow, ipcMain} = require('electron')

let win

module.exports = {
  open(parent) {
    win = new BrowserWindow({
      // parent,
      resizable: true,
      minimizable: true,
      maximizable: true,
      fullscreenable: true,
      backgroundColor: '#00000044',
      autoHideMenuBar: true,
      skipTaskbar: true
    })
    win.loadURL('file://' + global.appRoot + '/views/player.html')
    // console.log('Hiding Player window')
    win.hide()

    ipcMain.on('player', (event, args) => {
      const command = args.shift()
      win.webContents.send(command, args)
    })

    win.on('closed', () => {
      win = null
    })
    // Hide the window on close!
    win.on('close', e => {
      win.hide()
      e.preventDefault()
    })
    return win
  },
  isOpen() {
    const isOpen = (typeof win !== 'undefined')
    console.log('Is player open? ' + (isOpen ? 'It is.' : 'It\'s not.'))
    return isOpen
  }
}
