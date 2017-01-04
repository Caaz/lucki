document.addEventListener('DOMContentLoaded', () => {
  // this is our audio tag, which plays all the music. You'll probably need it.
  const audio = document.getElementsByTagName('AUDIO')[0]
  // Do some visualizer shit here, I guess.
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.onresize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  const ctx = canvas.getContext('2d')
  // ctx.globalCompositeOperation = 'source-over'

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  const analyser = audioCtx.createAnalyser()
  const source = audioCtx.createMediaElementSource(audio)

  source.connect(analyser)
  analyser.connect(audioCtx.destination)

  analyser.fftSize = 64

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)

  const visualizers = {
    spectrum(timestamp) {
      analyser.getByteFrequencyData(dataArray)
      // ctx.clearRect(0, 0, canvas.width, canvas.height)
      // ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'rgba(0, 0, 0, .1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // ctx.globalCompositeOperation = 'lighten'
      const barWidth = ((canvas.width - bufferLength) / bufferLength)
      for(let i = 0; i < bufferLength; i++) {
        const barHeight = canvas.height * dataArray[i] / 255

        let dicks = (i / bufferLength) * 360
        dicks = (dicks + (timestamp / 20)) % 360
        ctx.fillStyle = 'hsl(' + dicks + ', 100%,50%)'
        ctx.fillRect((barWidth * i) + i, canvas.height, barWidth, -barHeight)
      }
      requestAnimationFrame(visualizers.spectrum)
    }
  }
  visualizers.spectrum()
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
