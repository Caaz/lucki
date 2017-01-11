const whitelist = require(global.appRoot + '/src/view/visualizer/whitelist.json')
const electronSettings = require('electron-settings')
const $ = require('jquery')

const visualizers = {}
for(const i in whitelist) visualizers[whitelist[i]] = require(global.appRoot + '/src/view/visualizer/' + whitelist[i])

let audio
let analyser
let selected

function select(vis) {
  const selectText = 'Selected visualizer: ' + selected
  console.time(selectText)
  try {
    if(selected !== null && visualizers[selected] && visualizers[selected].destroy) visualizers[selected].destroy()
  } catch(err) {
    console.error('Visualizer destroy error: ' + err)
  }
  if(!visualizers[vis]) {
    console.error('INVALID VISUALIZER', 'The visualizer selected (' + vis + ') was not on the whitelist. Stopped selecting.')
    return false
  }
  selected = vis
  $('canvas').remove()
  const $canvas = $('<canvas>')
  $('body').append($canvas)
  maximize($('canvas')[0])
  try {
    if(visualizers[selected].init) visualizers[selected].init({analyser, canvas: $canvas[0]})
  } catch(err) {
    console.error('Visualizer init error: ' + err)
  }
  console.timeEnd(selectText)
}
function draw(timestamp) {
  try {
    visualizers[selected].draw(timestamp, {audio, analyser})
  } catch(err) {
    console.error('Visualizer draw error: ' + err)
    setTimeout(() => {
      requestAnimationFrame(draw)
    }, 5000)
    return false
  }
  requestAnimationFrame(draw)
}
function maximize(element) {
  element.height = window.innerHeight
  element.width = window.innerWidth
}
// Listeners
electronSettings.observe('visualizer.selected', e => {
  select(e.newValue)
})

$(() => {
  audio = $('audio')[0]
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)
  analyser.connect(audioCtx.destination)
  source.connect(analyser)
  let resizeDelayID
  $(window).resize(() => {
    if(resizeDelayID !== null) clearTimeout(resizeDelayID)
    resizeDelayID = setTimeout(() => {
      maximize($('canvas')[0])
    }, 100)
  })
  const $dropdown = $('#settings-visualizer-selected')
  $.each(visualizers, (k, v) => {
    let title = k
    title = (v.title) ? v.title : title[0].toUpperCase() + title.substring(1)
    $dropdown.append('<option value=\'' + k + '\'>' + title + '</option>')
  })
  select(electronSettings.getSync('visualizer.selected'))
  requestAnimationFrame(draw)
})
