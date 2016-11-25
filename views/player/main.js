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
  const updateTriggers = ['playing', 'pause', 'timeupdate']
  updateTriggers.forEach(trigger => {
    audio.addEventListener(trigger, () => {
      setState({trigger})
      update()
    })
  })
  ipcRenderer.on('pause', audio.pause)
})

ipcRenderer.on('play', (e, args) => {
  if(args.length > 0) {
    const track = ipcRenderer.sendSync('library', ['info', args[0]])
    if(track) {
      setState({libraryKey: args[0], track})
      const file = track.location.replace(/\?/g, '%3F')
      audio.src = file
      echo('Playing track:')
      echo(track)
    }
  }
  audio.play()
})
ipcRenderer.on('toggle', (e, a) => {
  const action = a.toString()
  if(action === 'play') {
    if(audio.paused) audio.play()
    else audio.pause()
  }
})

ipcRenderer.on('info', (e, track) => {
  if(state.track.location === track.location) {
    if(track.image) track.image.data = track.image.data.toString('base64')
    setState({track})
  }
})
