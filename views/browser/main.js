const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {sprintf} = require('sprintf-js')
const _ = require('tablesorter')
const config = require('./config.js')

let $currentPlaylist
let playerState
let searchID

ipcRenderer.on('library', (event, library) => {
  let newLibrary = ''
  for(const key in library) {
    if(library[key]) newLibrary += sprintf(config.TRACK_FORMAT, {key, track: library[key]})
  }
  $currentPlaylist.html(newLibrary)
  const $table = $currentPlaylist.parent()
  $table.tablesorter({
    // debug: true,
    widgets: ['saveSort', 'resizable', 'stickyHeaders', 'filter', 'zebra'],
    widgetOptions: {
      resizable: true,
      resizable_throttle: true,
      stickyHeaders_attachTo: 'main > div',
      stickyHeaders_yScroll: 'main > div',
      stickyHeaders_filteredToTop: true,
      filter_columnFilters: false,
      filter_ignoreCase: true
    }
  })
})
ipcRenderer.on('player-state', (event, state) => {
  if((!playerState) || (state.libraryKey !== playerState.libraryKey)) {
    $('#now-playing').html(sprintf(config.NOW_PLAYING_FORMAT, {key: state.libraryKey, track: state.track}))
    $('.playing').removeClass('playing')
    $('[data-library-key="' + state.libraryKey + '"]').addClass('playing')
  }
  if(state.ended && state.trigger === 'pause') next()
  playerState = state
  $('#playhead > span').css({width: ((state.currentTime / state.duration) * 100) + '%'})
  $('#control-toggle-play').toggleClass('fa-play', state.paused).toggleClass('fa-pause', !state.paused)
})
function play(obj) {
  let key
  if(typeof obj === 'string') key = obj
  else if(obj.jquery) key = obj[0].dataset.libraryKey
  else if(obj.dataset) key = obj.dataset.libraryKey
  if(key) ipcRenderer.send('player', ['play', key])
}
function next() {
  if($('#control-toggle-repeat').hasClass('enabled')) play(playerState.libraryKey)
  else if($('#control-toggle-shuffle').hasClass('enabled')) {
    const $tracks = $currentPlaylist.children()
    play($tracks[Math.floor(Math.random() * $tracks.length)])
  }
  else if(playerState && playerState.libraryKey) play($('[data-library-key="' + playerState.libraryKey + '"]').next())
  else play($currentPlaylist.children()[0])
}
function previous() {
  if(playerState && playerState.libraryKey) play($('[data-library-key="' + playerState.libraryKey + '"]').prev())
  else play($currentPlaylist.children()[0])
}
function search() {
  $('main > div > table').trigger('search', [['', '', '', $('#search input').val()]])
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
    $currentPlaylist = $('#track-list')
    ipcRenderer.send('library', ['get'])
    const $document = $(document)

    $document.keydown(e => {
      if(e.target.tagName === 'INPUT') {
        if(searchID) clearTimeout(searchID)
        searchID = setTimeout(search, 500)
      } else {
        let prevent = true
        if(e.key === 'ArrowRight') next()
        else if(e.key === 'ArrowLeft') previous()
        else if(e.key === 'ArrowUp') select($('.selected').prev())
        else if(e.key === 'ArrowDown') select($('.selected').next())
        else if(e.key === ' ') {
          ipcRenderer.send('player', ['toggle', 'play'])
          console.log('Sending toggle play')
        }
        else if(e.key === 'Enter') play($('.selected'))
        else prevent = false
        if(prevent) e.preventDefault()
      }
    })
    $document.click(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.selectable) select($(target))
        if(target.id) {
          if(target.id === 'control-previous-track') previous()
          else if(target.id === 'control-toggle-play') ipcRenderer.send('player', ['toggle', 'play'])
          else if(target.id === 'control-toggle-shuffle') $(target).toggleClass('enabled')
          else if(target.id === 'control-toggle-repeat') $(target).toggleClass('enabled')
          else if(target.id === 'control-next-track') next()
          else if(target.id === 'control-search') search()
        }
      })
    })
    $document.dblclick(e => {
      [e.target, e.target.parentNode].forEach(target => {
        if(target.dataset.libraryKey) ipcRenderer.send('player', ['play', target.dataset.libraryKey])
      })
    })
  }
}
