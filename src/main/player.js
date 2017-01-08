const {BrowserWindow, ipcMain, Menu} = require('electron')
const electronSettings = require('electron-settings')

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
      show: electronSettings.getSync('visualizer.openOnLaunch'),
      icon: 'assets/icon.png'
    })
    const position = electronSettings.getSync('visualizer.position')
    const bounds = electronSettings.getSync('visualizer.bounds')
    if(position) win.setPosition(position[0], position[1])
    if(bounds) win.setBounds(bounds)
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
    // win.hide()

    ipcMain.on('player', (event, args) => {
      const command = args.shift()
      win.webContents.send(command, args)
    })

    win.on('closed', () => {
      win = null
    })
    // Hide the window on close!
    win.on('close', e => {
      electronSettings.setSync('visualizer.position', win.getPosition())
      electronSettings.setSync('visualizer.bounds', win.getBounds())
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
