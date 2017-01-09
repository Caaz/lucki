let bufferLength
let data
let ctx
let canvas
module.exports = {
  init(initialize) {
    initialize.analyser.fftSize = 2048
    bufferLength = initialize.analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    canvas = initialize.canvas
    ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  },
  draw(timestamp, {analyser, audio}) {
    analyser.getByteTimeDomainData(data)
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1 + canvas.height / 500
    ctx.drawImage(canvas, 0, -2, canvas.width, canvas.height - 2)
    // ctx.drawImage(canvas, 0, 2, canvas.width, canvas.height + 4)
    // ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'rgba(45,45,45,0.025)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
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
      // ctx.strokeStyle = 'hsl(' + (360 * (i / bufferLength)) + ', 100%, ' + (50 + (y1 < 0 ? 1 : -1) * 50 * Math.pow(Math.abs(y1 / amplitude), 1 / 1)) + '%)'
      ctx.strokeStyle = 'hsl(150, 100%, ' + (50 + (y1 < 0 ? 1 : -1) * 50 * Math.pow(Math.abs(y1 / amplitude), 1 / 2)) + '%)'
      ctx.moveTo(x, y1)
      x += sliceWidth
      ctx.lineTo(x, y2)
      ctx.stroke()
      ctx.closePath()
    }
    // ctx.lineTo(canvas.width, 0)
    // ctx.stroke()
    ctx.restore()
    // ctx.translate(canvas.width / 2, canvas.height / 2)
    // ctx.rotate((Math.PI / (180.0 * Math.pow(2.0, 5))) * Math.cos(timestamp / 1440 - Math.PI * 3 / 32))
    // ctx.translate(-canvas.width / 2, -canvas.height / 2)
  }
}
