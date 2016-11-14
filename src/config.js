const {BrowserWindow} = require('electron')

let win
function open() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true
  })
  win.loadURL('file://' + global.appRoot + '/views/render.html?view=config')
  // Erase self when closing window.
  win.on('closed', () => {
    win = null
  })
}
module.exports = {
  open,
  isOpen: () => {
    return (win !== null)
  }
}
