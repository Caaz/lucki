const ipcRenderer = require('electron').ipcRenderer
const settings = require('electron-settings')

let audio
let state
let notification
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

document.addEventListener('DOMContentLoaded', () => {
  state = {}
  audio = document.getElementsByTagName('AUDIO')[0]
  settings.get('player').then(playerSettings => {
    console.log('got volume ' + playerSettings.volume)
    audio.volume = playerSettings.volume
  })
  const updateTriggers = ['playing', 'pause', 'timeupdate']
  updateTriggers.forEach(trigger => {
    audio.addEventListener(trigger, () => {
      Object.assign(state, {trigger})
      update()
    })
  })
  ipcRenderer.on('pause', audio.pause)
})
ipcRenderer.on('position', (e, args) => {
  echo('Setting position: ' + args[0])
  audio.currentTime = audio.duration * args[0]
})
ipcRenderer.on('volume', (e, args) => {
  echo('Setting volume: ' + args[0])
  audio.volume = args[0]
})
ipcRenderer.on('play', (e, args) => {
  if(args.length > 0) {
    const track = ipcRenderer.sendSync('library', ['info', args[0]])
    if(track) {
      Object.assign(state, {libraryKey: args[0], track})
      const file = track.location.replace(/\?/g, '%3F')
      audio.src = file
      echo('Playing track:')
      echo(track)
      if(notification) notification.close()
      try {
        notification = new Notification(track.title, {
          body: track.artist + ' - ' + track.album,
          // image: '../assets/icon.png',
          icon: '../assets/icon.png',
          silent: true,
          tag: 'nowPlaying'
          // actions: [
          //   {action: 'like', title: 'Pewke'}
          // ]
        })
        notification.onerror = err => {
          echo(err)
        }
        notification.onclick = () => {
          notification.close()
        }
      } catch(err) {
        echo('Notification Error: ' + err)
      }
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

// ipcRenderer.on('del', (e, track) => {
//   if(track.length > 0) {
//     ipcRenderer.sendSync('library', ['del', track])
//   }
// })

ipcRenderer.on('info', (e, track) => {
  if(state.track.location === track.location) {
    if(track.image) track.image.data = track.image.data.toString('base64')
    Object.assign(state, {track})
  }
})
