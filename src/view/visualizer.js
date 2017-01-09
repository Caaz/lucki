const electronSettings = require('electron-settings')

// Remember to add visualizers to views/player.pug
// I should just do it automagically.
const visualizers = {}
const whitelist = [
  'spectrum',
  'oscilliscope',
  'caaz',
  'twister',
  'three',
  'particles'
]
for(const i in whitelist) visualizers[whitelist[i]] = require(global.appRoot + '/src/view/visualizer/' + whitelist[i])

let analyser
let selected
let canvas
// const ctx = canvas.getContext('2d')
function select(vis) {
  selected = vis
  console.log('Selected visualizer: ' + selected)
  const canvases = document.getElementsByTagName('canvas')
  for(let i = canvases.length - 1; i >= 0; i--) canvases[i].parentNode.removeChild(canvases[i])
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  console.log(canvas)
  if(visualizers[selected].init) visualizers[selected].init({analyser, canvas})
}
electronSettings.observe('visualizer.selected', e => {
  select(e.newValue)
})
document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementsByTagName('AUDIO')[0]
  document.body.setAttribute('onresize', 'windowUpdate()')
  window.windowUpdate = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
  function draw(timestamp) {
    visualizers[selected].draw(timestamp, {audio, analyser})
    requestAnimationFrame(draw)
  }
  select(electronSettings.getSync('visualizer.selected'))
  requestAnimationFrame(draw)
})
