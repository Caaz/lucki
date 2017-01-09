let bufferLength
let data

// Just when I thought this was fancy I went and learned transform was a thing. fuck everyone.
function spectrum(canvas, ctx, width, scale) {
  const halfWidth = Math.floor(canvas.width / 2)
  const halfHeight = Math.floor(canvas.height / 2)
  ctx.beginPath()
  for(let horizontal = 1; horizontal > -2; horizontal -= 2) {
    for(let vertical = 1; vertical > -2; vertical -= 2) {
      ctx.moveTo(halfWidth, halfHeight)
      for(let i = 0; i < bufferLength; i++) {
        let rawHeight = data[i] / 256
        rawHeight = Math.pow(rawHeight, 5)
        const height = (halfHeight * rawHeight) * vertical
        ctx.lineTo(halfWidth + (width / 2 * i) * horizontal, halfHeight - height * scale)
      }
    }
  }
  ctx.fill()
}
module.exports = {
  init({analyser}) {
    analyser.fftSize = 512
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.getByteFrequencyData(data)
    // draw previous frame
    ctx.drawImage(canvas, -10, 0, canvas.width + 20, canvas.height)
    // darken it
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = '#EEE'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((canvas.width - width) / width)
    //
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'hsl(' + timestamp / 60 + ',100%,50%)'
    spectrum(canvas, ctx, scaledWidth, 1)
    ctx.fillStyle = '#000'
    spectrum(canvas, ctx, scaledWidth, 0.6)
  }
}
