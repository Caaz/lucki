const electron = require('electron')
const settings = require('electron-settings')
const {sprintf} = require('sprintf-js')
const $ = window.$ = window.jQuery = require('jquery')
require('tablesorter')
require('tablesorter/dist/js/widgets/widget-columnSelector.min.js')
require('bootstrap')
require('jquery-ui/ui/widget')
require('jquery-ui/ui/widgets/mouse')
require('jquery-ui/ui/widgets/slider')

const {ipcRenderer} = electron
const {dialog} = electron.remote

let $currentPlaylist
let $table
let playerState
let searchID
let disableSliderUpdates = false
const nil_track = {track: '', title: '', album: '', artist: '', genre: '', year: '', location: ''}

settings.observe('library', () => {
  // Should probably let the library decide when to update but I've not thought of a good way to handle that.
  ipcRenderer.send('library', ['update'])
})
ipcRenderer.on('library', (event, library) => {
  let newLibrary = ''
  for(const key in library) {
    if(library[key]) {
      const track = Object.assign({}, nil_track)
      Object.assign(track, library[key])
      newLibrary += sprintf('<tr data-selectable=true data-library-key="%(key)s">' +
        '<td>%(track.track)s</td>' +
        '<td>%(track.title)s</td>' +
        '<td>%(track.artist)s</td>' +
        '<td>%(track.album)s</td>' +
        '<td>%(track.year)s</td>' +
        '<td>%(track.genre)s</td>' +
        '<td>%(track.location)s</td>' +
      '</tr>', {key, track})
    }
  }
  const $newLibrary = $(newLibrary)
  $currentPlaylist
    .empty()
    .trigger('update')
    .html($newLibrary)
    .trigger('addRows', [$newLibrary, true])
})
ipcRenderer.on('player-state', (event, state) => {
  try {
    if((!playerState) || (playerState.track.image.data !== state.track.image.data)) {
      $('#album-art').html('<img src="data:' + state.track.image.mime + ';base64,' + state.track.image.data + '">').show()
    } else if (!state.track.image) {
      $('#album-art').hide()
    }
  } catch(err) {}
  if((!playerState) || (state.libraryKey !== playerState.libraryKey)) {
    $('#track-artist').text(state.track.artist)
    $('#track-album').text(state.track.album)
    $('#track-title').text(state.track.title)
    $('.playing').removeClass('playing')
    $('[data-library-key="' + state.libraryKey + '"]').addClass('playing')
  }
  if(state.ended && state.trigger === 'pause') next()
  playerState = state
  if(!disableSliderUpdates) {
    $('#playhead').slider('value', (state.currentTime / state.duration) * 100)
    $('#volume .slider').slider('value', state.volume * 100)
  }
  $('.fa-play, .fa-pause').toggleClass('fa-play', state.paused).toggleClass('fa-pause', !state.paused)
})

ipcRenderer.on('next', next)
ipcRenderer.on('previous', next)
ipcRenderer.on('playToggle', playToggle)
ipcRenderer.on('stop', stop)
ipcRenderer.on('del', del)
ipcRenderer.on('open-settings', () => {
  const mySettings = settings.getSync()
  $('#settings-library-directory').val(mySettings.library.directory)
  $('#settings-subdirectories')[0].checked = mySettings.library.subdirectories
  $('#settings-hide-menu')[0].checked = mySettings.browser.hideMenu
  $('#settings-modal').modal('show')
})

function del(obj) {
  let key
  if(typeof obj === 'string') key = obj
  else if(obj.jquery) key = obj[0].dataset.libraryKey
  else if(obj.dataset) key = obj.dataset.libraryKey
  if(key) {
    ipcRenderer.send('library', ['del', key])
    $('[data-library-key=' + key + ']').remove()
  }
}
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
  if($('#toggle-repeat').hasClass('enabled')) play(playerState.libraryKey)
  else if($('#toggle-shuffle').hasClass('enabled')) {
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
  const col = [] // Dynamic bullshit!
  col[$table.find('thead tr').children().length] = $('#search-input').val()
  $table.trigger('search', [col])
}
function select($item) {
  if($item.length === 0) return
  $('tr.selected').removeClass('selected')
  $item.addClass('selected')
  const topAdjust = $item.offset().top - $('tbody').offset().top - $('body')[0].scrollTop
  const bottomAdjust = topAdjust + $item.height() - $(window).height() + $('tbody').offset().top
  if(topAdjust < 0) $('body')[0].scrollTop += topAdjust
  else if(bottomAdjust > 0) $('body')[0].scrollTop += bottomAdjust
}

$(() => {
  $currentPlaylist = $('#track-list')
  $table = $currentPlaylist.parent()
  ipcRenderer.send('library', ['get'])
  const $document = $(document)
  $('#settings-modal').on('hidden.bs.modal', () => {
    settings.setSync('browser', {
      hideMenu: $('#settings-hide-menu')[0].checked
    })
    settings.setSync('library', {
      directory: $('#settings-library-directory').val(),
      subdirectories: $('#settings-subdirectories')[0].checked
    })
  })
  $('#album-art').hide()
  $('#volume').slider({
    value: settings.getSync('player.volume'),
    step: 0.001,
    start() {
      $('#volume').slider('value', 0)
      disableSliderUpdates = true
    },
    slide(e, ui) {
      ipcRenderer.send('player', ['volume', ui.value / 100])
    },
    stop(e, ui) {
      ipcRenderer.send('player', ['volume', ui.value / 100])
      settings.setSync('player.volume', ui.value / 100)
      disableSliderUpdates = false
    }
  })
  $('#volume-modal').on('hidden.bs.modal', () => {
    disableSliderUpdates = false
  })
  $('#playhead').slider({
    step: 0.001,
    start() {
      disableSliderUpdates = true
    },
    stop(e, ui) {
      ipcRenderer.send('player', ['position', ui.value / 100])
      disableSliderUpdates = false
    }
  })
  $table.tablesorter({
    widgets: ['saveSort', 'resizable', 'filter', 'zebra', 'stickyHeaders', 'columnSelector'],
    widgetOptions: {
      // columnSelector_container: $('#column-selection'),
      resizable: true,
      resizable_throttle: true,
      resizable_addLastColumn: true,
      stickyHeaders_offset: '60px',
      stickyHeaders_filteredToTop: true,
      filter_columnFilters: false,
      filter_ignoreCase: true
    }
  })
  $.tablesorter.columnSelector.attachTo($table, '#column-selection')
  $('#hide-columns')
  .popover({
    placement: 'right',
    html: true,
    content: $('#column-selection')
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
      else if(e.key === 'Delete' && e.ctrlKey && e.shiftKey) del($('.selected'))
      else prevent = false
      if(prevent) e.preventDefault()
    }
  })
  $document.click(e => {
    [e.target, e.target.parentNode].forEach(target => {
      if(target.dataset.selectable) select($(target))
      if(target.id) {
        if(target.id === 'previous-track') previous()
        else if(target.id === 'toggle-play') ipcRenderer.send('player', ['toggle', 'play'])
        else if(target.id === 'toggle-shuffle') $(target).toggleClass('enabled')
        else if(target.id === 'toggle-repeat') $(target).toggleClass('enabled')
        else if(target.id === 'next-track') next()
        else if(target.id === 'search') search()
        else if(target.id === 'now-playing') select($('[data-library-key="' + playerState.libraryKey + '"]'))
        else if(target.id === 'toggle-volume') {
          if(playerState && playerState.volume) {
            console.log('setting value: ' + playerState.volume)
            $('#volume')
              .slider('value', 0)
              .slider('value', playerState.volume * 100)
          }
        }
        else if(target.id === 'find-library-directory') {
          const path = dialog.showOpenDialog({properties: ['openDirectory']})[0]
          $('#settings-library-directory').val(path)
        }
      }
    })
  })
  $document.dblclick(e => {
    [e.target, e.target.parentNode].forEach(target => {
      if(target.dataset.libraryKey) ipcRenderer.send('player', ['play', target.dataset.libraryKey])
    })
  })
})
