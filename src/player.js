const {BrowserWindow, ipcMain} = require('electron')

let win

module.exports = {
  open(parent) {
    //parent.BrowserWindow.x = 0;

    win = new BrowserWindow({
      //parent: parent,
      height: 600,
      width: 600,
      resizable: true,
      minimizable: true,
      maximizable: true,
      fullscreenable: true,
      backgroundColor: '#00000044',
      autoHideMenuBar: true,
      //skipTaskbar: false,
      icon: 'assets/icon.png'
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
