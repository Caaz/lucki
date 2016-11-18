const {ipcRenderer} = require('electron')

let audio
let state
// let continousUpdate = false

function echo(obj) {
  ipcRenderer.send('echo', obj)
}
function update() {
  state.paused = audio.paused
  // state.loop = audio.loop
  state.muted = audio.muted
  state.playbackRate = audio.playbackRate
  state.volume = audio.volume
  state.currentTime = audio.currentTime
  state.duration = audio.duration
  state.ended = audio.ended
  ipcRenderer.send('player-state', state)
}
function setState(obj) {
  for(const key in obj) {
    if(obj[key]) state[key] = obj[key]
  }
}

document.addEventListener('DOMContentLoaded', () => {
  state = {}
  audio = document.getElementsByTagName('AUDIO')[0]
  const updateTriggers = ['playing', 'pause']
  updateTriggers.forEach(e => {
    audio.addEventListener(e, update)
  })
})

ipcRenderer.on('play', (event, args) => {
  if(args.length > 0) {
    const track = ipcRenderer.sendSync('library', ['info', args[0]])
    if(track) {
      setState({libraryKey: args[0], track})
      audio.src = track.location
      echo('Playing track: ' + track.location)
    }
  }
  audio.play()
})
ipcRenderer.on('pause', audio.pause)
ipcRenderer.on('toggle', (e, args) => {
  switch(args[0]) {
    case 'play':
      if(audio.paused) audio.play()
      else audio.pause()
    default:
  }
})
