const {BrowserWindow,Menu} = require('electron');
// Library management.
// const library = require('./library')

let win
function isOpen() { return (win != null); }
function open () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar:true
  })
  win.loadURL('file://'+global.appRoot+'/views/render.html?view=config')
  // Erase self when closing window.
  win.on('closed', function () { win = null })
}
module.exports = {
  open: open,
  isOpen: isOpen
}
