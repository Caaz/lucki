let bufferLength
let data
module.exports = {
  init({analyser}) {
    analyser.fftSize = 2048 * 4
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, audio, ctx}) {
    analyser.getByteTimeDomainData(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    ctx.strokeStyle = '#0fb'
    ctx.save()
    ctx.translate(0, canvas.height / 2)
    ctx.beginPath()
    const sliceWidth = canvas.width / (bufferLength - 1)
    let x = sliceWidth
    ctx.moveTo(0, 0)
    for(let i = 0; i < bufferLength; i++) {
      const amplitude = (canvas.height / 5) * (Math.log((1 - audio.volume) * (Math.E - 1) + 2))
      // (-0.5 * Math.pow(audio.volume, 1 / 3) + 1)
      // (Math.log((1 - audio.volume) * (Math.E - 1) + 2))
      const y = data[i] / 128.0 * amplitude - amplitude
      ctx.lineTo(x, y)
      x += sliceWidth
    }
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
    ctx.restore()
  }
}
