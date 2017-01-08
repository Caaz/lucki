const {BrowserWindow, ipcMain, Menu} = require('electron')

let win

module.exports = {
  open() {
    //  parent.BrowserWindow.x = 0;

    win = new BrowserWindow({
      resizable: true,
      minimizable: true,
      maximizable: true,
      fullscreenable: true,
      autoHideMenuBar: true,
      icon: 'assets/icon.png'
    })
    win.loadURL('file://' + global.views.player)
    win.setMenu(Menu.buildFromTemplate([
      {
        label: 'View',
        submenu: [
          {role: 'togglefullscreen'},
          {role: 'toggledevtools'},
          {role: 'reload'},
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
