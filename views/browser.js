const {ipcRenderer} = require('electron')
const $ = require('jquery')
const {sprintf} = require('sprintf-js')
require('tablesorter')

const config = {
  TRACK_FORMAT:
    '<tr data-selectable=true data-library-key="%(key)s">' +
      '<td>%(track.title)s</td>' +
      '<td>%(track.artist)s</td>' +
      '<td>%(track.album)s</td>' +
    '</tr>',
  NOW_PLAYING_FORMAT:
    '<span>%(track.title)s</span>' +
    '<span class="small">%(track.artist)s - %(track.album)s</span>'
}

let $currentPlaylist
let $table
let playerState
let searchID

ipcRenderer.on('library', (event, library) => {
  let newLibrary = ''
  for(const key in library) {
    if(library[key]) newLibrary += sprintf(config.TRACK_FORMAT, {key, track: library[key]})
  }
  const $newLibrary = $(newLibrary)
  $currentPlaylist.html($newLibrary).trigger('addRows', [$newLibrary, true])
})
ipcRenderer.on('player-state', (event, state) => {
  try {
    if((!playerState) || (playerState.track.image.data !== state.track.image.data)) {
      $('#album-art').html('<img src="data:' + state.track.image.mime + ';base64,' + state.track.image.data + '">')
    } else if (!state.track.image) {
      $('#album-art').empty()
    }
  } catch(err) {}
  if((!playerState) || (state.libraryKey !== playerState.libraryKey)) {
    $('#track-info').html(sprintf(config.NOW_PLAYING_FORMAT, {key: state.libraryKey, track: state.track}))
    $('.playing').removeClass('playing')
    $('[data-library-key="' + state.libraryKey + '"]').addClass('playing')
  }
  if(state.ended && state.trigger === 'pause') next()
  playerState = state
  $('#playhead > span').css({width: ((state.currentTime / state.duration) * 100) + '%'})
  $('#control-toggle-play').toggleClass('fa-play', state.paused).toggleClass('fa-pause', !state.paused)
})
ipcRenderer.on('next', next)
ipcRenderer.on('previous', next)
ipcRenderer.on('playToggle', playToggle)
ipcRenderer.on('stop', stop)

function stop() {
  // This should do something else, but for now simply always pausing is fine.
  if(!playerState.paused) ipcRenderer.send('player', ['toggle', 'play'])
}
function playToggle() {
  ipcRenderer.send('player', ['toggle', 'play'])
}
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

$(() => {
  $currentPlaylist = $('#track-list')
  $table = $currentPlaylist.parent()
  ipcRenderer.send('library', ['get'])
  const $document = $(document)
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
      else if(e.key === ' ') playToggle()
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
})
