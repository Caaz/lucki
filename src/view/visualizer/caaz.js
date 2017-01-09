let bufferLength
let data
let ctx
let cv
// Just when I thought this was fancy I went and learned transform was a thing. fuck everyone.
function spectrum(cv, ctx, width, scale) {
  const halfWidth = Math.floor(cv.width / 2)
  const halfHeight = Math.floor(cv.height / 2)
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
  init({analyser, canvas}) {
    analyser.fftSize = 512
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    cv = canvas
    ctx = cv.getContext('2d')
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    // draw previous frame
    ctx.drawImage(cv, -10, 0, cv.width + 20, cv.height)
    // darken it
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = '#EEE'
    ctx.fillRect(0, 0, cv.width, cv.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((cv.width - width) / width)
    //
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = 'hsl(' + timestamp / 60 + ',100%,50%)'
    spectrum(cv, ctx, scaledWidth, 1)
    ctx.fillStyle = '#000'
    spectrum(cv, ctx, scaledWidth, 0.6)
  }
}
