let bufferLength
let data

let ctx
let amplitude
let sliceWidth
function drawOsc() {
  ctx.beginPath()
  let x = 0
  for(let i = 0; i < bufferLength; i++) {
    const y2 = data[i + 1] / 128.0 * amplitude - amplitude
    x += sliceWidth
    ctx.lineTo(x, y2)
  }
  ctx.stroke()
}
module.exports = {
  init({analyser}) {
    analyser.fftSize = 2048
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, audio}) {
    const halfWidth = Math.floor(canvas.width / 2)
    const halfHeight = Math.floor(canvas.height / 2)
    ctx = canvas.getContext('2d')
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, halfHeight)
    ctx.strokeStyle = 'hsl(' + timestamp / 60 + ',100%,50%)'
    ctx.lineWidth = 4
    drawOsc()
    ctx.restore()

    analyser.getByteTimeDomainData(data)

    ctx.save()
    ctx.translate(halfWidth, halfHeight)
    ctx.rotate(0.02)
    ctx.scale(0.99, 0.99)
    ctx.drawImage(canvas, -halfWidth, -halfHeight)
    ctx.restore()
    // I'm not going to act like this was on purpose, it just happened to make a cool effect
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = 'hsl(' + (100 + timestamp / 60) + ',60%,99%)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.globalCompositeOperation = 'source-over'

    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    sliceWidth = canvas.width / (bufferLength - 1)
    amplitude = (canvas.height / 5) * (Math.log((1 - audio.volume) * (Math.E - 1) + 2))
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, halfHeight)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    drawOsc()
    ctx.restore()
  }
}
