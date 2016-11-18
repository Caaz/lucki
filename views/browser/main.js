const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {sprintf} = require('sprintf-js')
const config = require('./config.js')

let $library
let playerState

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
  playerState = state
  console.log(state)
  $('.playing').removeClass('playing')
  $('#now-playing').html(sprintf(config.NOW_PLAYING_FORMAT, {track: state.track}))
  $('#control-toggle-play').toggleClass('fa-play', state.paused).toggleClass('fa-pause', !state.paused)
  if(!state.paused) {
    $('[data-library-key="' + playerState.libraryKey + '"]').addClass('playing')
  }
  if(state.ended) {
    next()
  }
})
function next() {
  if(playerState && playerState.libraryKey) {
    $('[data-library-key="' + playerState.libraryKey + '"]').next().dblclick()
  }
  else {
    $library.first().dblclick()
  }
}
function previous() {
  if(playerState && playerState.libraryKey) {
    $('[data-library-key="' + playerState.libraryKey + '"]').prev().dblclick()
  }
  else {
    $library.first().dblclick()
  }
}

function select($item) {
  if($item.length === 0) return
  $('tr.selected').removeClass('selected')
  $item.addClass('selected')
  const $content = $('main > div')
  const topAdjust = $item.offset().top - $content.offset().top
  const bottomAdjust = topAdjust + $item.height() - $content.height()
  if(topAdjust < 0) $content[0].scrollTop += topAdjust
  else if(bottomAdjust > 0) $content[0].scrollTop += bottomAdjust
}

module.exports = {
  ready() {
    $library = $('#track-list')
    ipcRenderer.send('library', ['get'])
    const $document = $(document)

    $document.keydown(e => {
      if(e.target.tagName === 'INPUT') {
        // Search
        // if(searchable) { searchable = false; window.setTimeout(search,1000); }
      } else {
        let prevent = true
        if(e.key === 'ArrowRight') next()
        else if(e.key === 'ArrowLeft') previous()
        else if(e.key === 'ArrowUp') select($('.selected').prev())
        else if(e.key === 'ArrowDown') select($('.selected').next())
        else if(e.key === ' ') ipcRenderer.send('player', ['toggle', 'play'])
        else if(e.key === 'Enter') {
          const selected = $('.selected')[0]
          if(selected && selected.dataset.libraryKey) ipcRenderer.send('player', ['play', selected.dataset.libraryKey])
        }
        else prevent = false
        if(prevent) e.preventDefault()
      }
    })
    $document.click(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.selectable) select($(target))
        if(target.id) console.log('This has an ID of ' + target.id)
      })
    })
    $document.dblclick(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.libraryKey) ipcRenderer.send('player', ['play', target.dataset.libraryKey])
      })
    })
  }
}
