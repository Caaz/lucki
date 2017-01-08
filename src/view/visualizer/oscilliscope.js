let bufferLength
let data
module.exports = {
  init({analyser}) {
    analyser.fftSize = 2048
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, audio, ctx}) {
    analyser.getByteTimeDomainData(data)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    // ctx.drawImage(canvas, 0, -10, canvas.width, canvas.height - 10)
    // ctx.globalCompositeOperation = 'multiply'
    // ctx.fillStyle = '#aaa'
    // ctx.fillRect(0, 0, canvas.width, canvas.height)
    // ctx.globalCompositeOperation = 'source-over'
    ctx.save()
    ctx.translate(0, canvas.height / 2)
    const sliceWidth = canvas.width / (bufferLength - 1)
    let x = 0

    // (-0.5 * Math.pow(audio.volume, 1 / 3) + 1)
    // (Math.log((1 - audio.volume) * (Math.E - 1) + 2))

    const amplitude = (canvas.height / 5) * (Math.log((1 - audio.volume) * (Math.E - 1) + 2))
    for(let i = 0; i < bufferLength; i++) {
      const y1 = data[i] / 128.0 * amplitude - amplitude
      const y2 = data[i + 1] / 128.0 * amplitude - amplitude
      ctx.beginPath()
      ctx.strokeStyle = 'hsl(' + (360 + timestamp / 60) * (1 - y1 / amplitude) + ', 100%, 50%)'
      ctx.moveTo(x, y1)
      x += sliceWidth
      ctx.lineTo(x, y2)
      ctx.stroke()
      ctx.closePath()
    }
    // ctx.lineTo(canvas.width, 0)
    // ctx.stroke()
    ctx.restore()
  }
}
