const electronSettings = require('electron-settings')

const vRoot = global.appRoot + '/src/view/visualizer/'
const visualizers = {
  spectrum: require(vRoot + 'spectrum'),
  oscilliscope: require(vRoot + 'oscilliscope'),
  caaz: require(vRoot + 'caaz')
}
let analyser
let selected
function select(vis) {
  selected = vis
  console.log('Selected visualizer: ' + selected)
  if(visualizers[selected].init) visualizers[selected].init({analyser})
}
electronSettings.observe('visualizer.selected', e => {
  select(e.newValue)
})

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementsByTagName('AUDIO')[0]
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.setAttribute('onresize', 'windowUpdate()')
  window.windowUpdate = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  const ctx = canvas.getContext('2d')
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
  function draw(timestamp) {
    visualizers[selected].draw(timestamp, {canvas, ctx, audio, analyser})
    requestAnimationFrame(draw)
  }
  select(electronSettings.getSync('visualizer.selected'))
  requestAnimationFrame(draw)
})
