const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {sprintf} = require('sprintf-js')
const config = require('./config.js')

let $library // Our library jQuery object.
let keys // Our keys
// let audio // Our audio object

ipcRenderer.on('library', (event, library) => {
  keys = Object.keys(library)
  let newLibrary = ''
  for(const key in keys) {
    if(library[key] !== null) {
      newLibrary += sprintf(config.TRACK_FORMAT, {key, track: library[key]})
    }
  }
  $library.html(newLibrary)
})

function getDataWithParent(target) {
  const data = target.parentNode.dataset
  for(const key in target.dataset) {
    if(target[key] !== null) data[key] = target[key]
  }
  return data
}
module.exports = {
  ready: () => {
    $library = $('#library')
    ipcRenderer.send('library', 'get')
    const $document = $(document)
    $document.click(e => {
      const data = getDataWithParent(e.target)
      if(data.selectable) console.log('This is selectable!')
      if(data.libraryKey) console.log('This is playable: ' + data.libraryKey)
      else if(e.target.id) console.log('This has an ID of ' + e.target.id)
      // console.log(e.target.parentNode.dataset)
    })
    $document.dblclick(e => {
      const data = getDataWithParent(e.target)
      if(data.libraryKey) ipcRenderer.send('play', data.libraryKey)
    })
  }
}
