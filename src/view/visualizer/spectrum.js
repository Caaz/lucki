let bufferLength
let data
let canvas
let ctx
module.exports = {
  init(initialize) {
    initialize.analyser.fftSize = 256
    bufferLength = initialize.analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    canvas = initialize.canvas
    ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const barWidth = ((canvas.width - width) / width)
    for(let i = 0; i < width; i++) {
      const barHeight = canvas.height * data[i] / 256
      let dicks = (i / bufferLength) * 360
      dicks = (dicks + (timestamp / 20)) % 360
      ctx.fillStyle = 'hsl(' + dicks + ', 100%,50%)'
      ctx.fillRect((barWidth * i) + i + 1, canvas.height, barWidth, -barHeight)
    }
  }
}
