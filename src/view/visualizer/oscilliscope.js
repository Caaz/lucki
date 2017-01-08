let bufferLength
let data
module.exports = {
  init({analyser}) {
    analyser.fftSize = 2048 * 4
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.getByteTimeDomainData(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#0fb'
    ctx.beginPath()

    const sliceWidth = Number(canvas.width) * 1.0 / bufferLength
    let x = 0

    for(let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0
      const y = v * canvas.height / 2
      if(i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
      x += sliceWidth
    }
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
  }
}
