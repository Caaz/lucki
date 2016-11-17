const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {sprintf} = require('sprintf-js')
const config = require('./config.js')

let $library

ipcRenderer.on('library', (event, library) => {
  let newLibrary = ''
  for(const key in library) {
    if(library[key]) {
      newLibrary += sprintf(config.TRACK_FORMAT, {key, track: library[key]})
    }
  }
  $library.html(newLibrary)
})
ipcRenderer.on('player-state', (event, state) => {
  console.log(state)
  $('#now-playing').html(sprintf(config.NOW_PLAYING_FORMAT, {track: state.track}))
  $('#control-toggle-play').toggleClass('fa-play', state.paused).toggleClass('fa-pause', state.paused)
})

module.exports = {
  ready() {
    $library = $('#library')
    ipcRenderer.send('library', ['get'])
    const $document = $(document)
    $document.click(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.selectable) console.log('This is selectable!')
        if(target.dataset.libraryKey) console.log('This is playable: ' + target.dataset.libraryKey)
        else if(target.id) console.log('This has an ID of ' + target.id)
      })
      // console.log(e.target.parentNode.dataset)
    })
    $document.dblclick(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.libraryKey) ipcRenderer.send('player', ['play', target.dataset.libraryKey])
      })
    })
  }
}
