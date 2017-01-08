const electronSettings = require('electron-settings')

const visualizers = {
  spectrum: require(global.appRoot + '/src/view/visualizer/spectrum')
}

let selected
electronSettings.observe('visualizer.selected', e => {
  selected = e.newValue
  console.log('Selected visualizer: ' + selected)
})

document.addEventListener('DOMContentLoaded', () => {
  selected = electronSettings.getSync('visualizer.selected')
  console.log('Selected visualizer: ' + selected)
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
  const analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)
  source.connect(analyser)
  analyser.connect(audioCtx.destination)
  function draw(timestamp) {
    // fallback if selected doesn't exist. Just gotta make sure spectrum does.
    if(visualizers[selected] === null) selected = 'spectrum'
    visualizers[selected].draw(timestamp, {canvas, ctx, analyser})
    requestAnimationFrame(draw)
  }
  draw()

  // const visualizers = {
  //   spectrum(timestamp) {
  //     analyser.fftSize = 256
  //     const bufferLength = analyser.frequencyBinCount
  //     const dataArray = new Uint8Array(bufferLength)
  //     analyser.getByteFrequencyData(dataArray)
  //     ctx.clearRect(0, 0, canvas.width, canvas.height)
  //     // ctx.globalCompositeOperation = 'source-over'
  //     // ctx.fillStyle = 'rgba(0, 0, 0, .1)'
  //     // ctx.fillRect(0, 0, canvas.width, canvas.height)
  //     // ctx.globalCompositeOperation = 'lighten'
  //     const width = parseInt(bufferLength * 5 / 6, 10)
  //     const barWidth = ((canvas.width - width) / width)
  //     for(let i = 0; i < bufferLength; i++) {
  //       const barHeight = canvas.height * dataArray[i] / 256
  //       let dicks = (i / bufferLength) * 360
  //       dicks = (dicks + (timestamp / 20)) % 360
  //       ctx.fillStyle = 'hsl(' + dicks + ', 100%,50%)'
  //       ctx.fillRect((barWidth * i) + i + 1, canvas.height, barWidth, -barHeight)
  //     }
  //     nextFrame()
  //   },
  //
  //   // Colorized like default theme, probably should read in color from preferences or .css
  //   oscilliscope() {
  //     analyser.fftSize = 2048 * 4
  //     const bufferLength = analyser.frequencyBinCount
  //     const dataArray = new Uint8Array(bufferLength)
  //     analyser.getByteTimeDomainData(dataArray)
  //     const dim = Math.min(canvas.width, canvas.height)
  //     ctx.lineWidth = 1 / 600 * dim
  //     const sliceWidth = dim / (bufferLength - 1)
  //
  //     ctx.fillStyle = 'rgb(34, 34, 34)'
  //     ctx.fillRect(0, 0, canvas.width, canvas.height)
  //
  //     ctx.beginPath()
  //     // ctx.moveTo(0,-canvas.height/2);
  //     ctx.save()
  //     ctx.translate((canvas.width - dim) / 2, -canvas.height / 2)
  //
  //     // ctx.fillStyle = 'rgb(45, 45, 45)'
  //     // ctx.arc(dim / 2, canvas.height, dim / 2, 0, Math.PI * 2)
  //     // ctx.fill()
  //     // ctx.closePath()
  //
  //     // ctx.beginPath()
  //     for (let i = 0; i < bufferLength; i++) ctx.lineTo(sliceWidth * i, dataArray[i] / 128 * canvas.height)
  //     ctx.restore()
  //     // ctx.translate(canvas.width / 2, canvas.height / 2)
  //     // ctx.rotate(1 * Number(Math.PI) / 180)
  //     // ctx.translate(-canvas.width / 2, -canvas.height / 2)
  //     ctx.strokeStyle = 'rgb(0, 255, 187)'
  //
  //     ctx.stroke()
  //     nextFrame()
  //   }
  //   // //////////////////////////////
  // }
})

// I want this later but for now it's causing xo issues.
// function oscilliscope() {
//   analyser.fftSize = 2048
//   let bufferLength = analyser.frequencyBinCount
//   let dataArray = new Uint8Array(bufferLength)
//
//   function draw() {
//
//     drawVisual = requestAnimationFrame(draw)
//     analyser.getByteTimeDomainData(dataArray)
//
//     ctx.fillStyle = 'rgb(200, 200, 200)'
//     ctx.fillRect(0, 0, canvas.width, canvas.height)
//
//     ctx.lineWidth = 2
//     ctx.strokeStyle = 'rgb(0, 0, 0)'
//     ctx.beginPath()
//
//     let sliceWidth = canvas.width * 1.0 / bufferLength
//     let x = 0
//
//     for(let i = 0; i < bufferLength; i++) {
//
//       let v = dataArray[i] / 128.0
//       let y = v * canvas.height/2
//
//       if(i === 0) ctx.moveTo(x, y)
//       else ctx.lineTo(x, y)
//       x += sliceWidth
//     }
//     ctx.lineTo(canvas.width, canvas.height/2)
//     ctx.stroke()
//   }
//   draw()
// }
