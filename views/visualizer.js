document.addEventListener('DOMContentLoaded', () => {
  // this is our audio tag, which plays all the music. You'll probably need it.
  const audio = document.getElementsByTagName('AUDIO')[0]
  // Do some visualizer shit here, I guess.
  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.setAttribute('onresize', 'windowUpdate()')
  windowUpdate = () => {
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

  const visualizers = {
    spectrum(timestamp) {
      analyser.fftSize = 256
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteFrequencyData(dataArray)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // ctx.globalCompositeOperation = 'source-over'
      // ctx.fillStyle = 'rgba(0, 0, 0, .1)'
      // ctx.fillRect(0, 0, canvas.width, canvas.height)
      // ctx.globalCompositeOperation = 'lighten'
      const width = parseInt(bufferLength * 5 / 6, 10)
      const barWidth = ((canvas.width - width) / width)
      for(let i = 0; i < bufferLength; i++) {
        const barHeight = canvas.height * dataArray[i] / 256
        let dicks = (i / bufferLength) * 360
        dicks = (dicks + (timestamp / 20)) % 360
        ctx.fillStyle = 'hsl(' + dicks + ', 100%,50%)'
        ctx.fillRect((barWidth * i) + i + 1, canvas.height, barWidth, -barHeight)
      }
      requestAnimationFrame(visualizers.spectrum)
    },

    // Colorized like default theme, probably should read in color from preferences or .css
    oscilliscope() {
      analyser.fftSize = 2048 * 4
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      analyser.getByteTimeDomainData(dataArray)
      const dim = Math.min(canvas.width, canvas.height)
      ctx.lineWidth = 1 / 600 * dim
      let sliceWidth = dim
      sliceWidth /= (bufferLength - 1)

      ctx.fillStyle = 'rgb(34, 34, 34)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      // ctx.moveTo(0,-canvas.height/2);
      ctx.save()
      ctx.translate((canvas.width - dim) / 2, -canvas.height / 2)
      ctx.fillStyle = 'rgb(45, 45, 45)'
      ctx.arc(dim / 2, canvas.height, dim / 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
      ctx.beginPath()
      ctx.moveTo((canvas.width - dim) / 2, -canvas.height / 2)
      let _max = 0
      for (let i = 0; i < bufferLength; i++) {
        // if (dataArray[i] / 256 > _max) _max = dataArray[i] / 256
        dataArray[i] *= canvas.height / (256)
        // dataArray[i] -= canvas.height / 2
        // ctx.lineTo(sliceWidth * i, dataArray[i])
        ctx.lineTo(canvas.width, canvas.height / 2)
      }
      // for (let i = 0; i < bufferLength; i++) ctx.lineTo(sliceWidth * i, (dataArray[i] / 256) * (2 / _max) * dim + canvas.height)
      // for (let i = 0; i < bufferLength; i++) console.log(dataArray[i])//
      ctx.restore()
      // ctx.translate(canvas.width / 2, canvas.height / 2)
      // ctx.rotate(1 * Number(Math.PI) / 180)
      // ctx.translate(-canvas.width / 2, -canvas.height / 2)
      ctx.strokeStyle = 'rgb(0, 255, 187)'

      ctx.stroke()
      requestAnimationFrame(visualizers.oscilliscope)
    }
    // //////////////////////////////
  }
  visualizers.oscilliscope()
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
