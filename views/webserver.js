// const $
// require('tablesorter')

let $table
let $currentPlaylist
let playerState
let disableSliderUpdates = false
const ipcRenderer = {
  // Alright let's fake some shit
  send(hook, data) {
    // Do something
    console.log('Sending ' + hook + ': ' + JSON.stringify(data))
  }
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
  $('#volume').hide()
  $('#volume > .slider').slider({
    value: 100,
    step: 0.001,
    start() {
      $('#volume .slider').slider('value', 0)
      disableSliderUpdates = true
    },
    stop(e, ui) {
      ipcRenderer.send('player', ['volume', ui.value / 100])
      disableSliderUpdates = false
      $('#volume').hide()
    }
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
    // debug: true,
    widgets: ['saveSort', 'resizable', 'filter', 'zebra'],
    widgetOptions: {
      resizable: true,
      resizable_throttle: true,
      // stickyHeaders_attachTo: 'main > div',
      // stickyHeaders_yScroll: 'main > div',
      // stickyHeaders_filteredToTop: true,
      filter_columnFilters: false,
      filter_ignoreCase: true
    }
  })
  // $document.keydown(e => {
  //   if(e.target.tagName === 'INPUT') {
  //     if(searchID) clearTimeout(searchID)
  //     searchID = setTimeout(search, 500)
  //   } else {
  //     let prevent = true
  //     if(e.key === 'ArrowRight') next()
  //     else if(e.key === 'ArrowLeft') previous()
  //     else if(e.key === 'ArrowUp') select($('.selected').prev())
  //     else if(e.key === 'ArrowDown') select($('.selected').next())
  //     else if(e.key === ' ') playToggle()
  //     else if(e.key === 'Enter') play($('.selected'))
  //     else prevent = false
  //     if(prevent) e.preventDefault()
  //   }
  // })
  $document.click(e => {
    [e.target, e.target.parentNode].forEach(target => {
      if(target.dataset.selectable) select($(target))
      if(target.id) {
        if(target.id === 'control-previous-track') previous()
        else if(target.id === 'control-toggle-play') ipcRenderer.send('player', ['toggle', 'play'])
        else if(target.id === 'control-toggle-shuffle') $(target).toggleClass('enabled')
        else if(target.id === 'control-toggle-repeat') $(target).toggleClass('enabled')
        else if(target.id === 'control-toggle-volume') {
          disableSliderUpdates = true
          if(playerState && playerState.volume) {
            console.log('setting value: ' + playerState.volume)
            $('#volume .slider')
              // Fuck you, jQuery UI.
              .slider('value', 0)
              .slider('value', playerState.volume * 100)
          }
          $('#volume').show()
        }
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
