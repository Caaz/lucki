let bufferLength
let data
function spectrum(canvas, ctx, width, scale) {
  ctx.beginPath()
  ctx.moveTo(0, canvas.height / 2)
  for(let i = 0; i < bufferLength; i++) {
    const height = canvas.height / 2 * data[i] / 256
    ctx.lineTo((width * i), canvas.height / 2 - 1 - height * scale)
  }
  ctx.lineTo(canvas.width, canvas.height / 2)
  ctx.fill()
  // if I were really fancy I'd continue it backwards...
  ctx.beginPath()
  ctx.moveTo(0, canvas.height / 2)
  for(let i = 0; i < bufferLength; i++) {
    const height = -(canvas.height / 2 * data[i] / 256)
    ctx.lineTo((width * i), canvas.height / 2 - 1 - height * scale)
  }
  ctx.lineTo(canvas.width, canvas.height / 2)
  ctx.fill()
}
module.exports = {
  init({analyser}) {
    analyser.fftSize = 256
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.getByteFrequencyData(data)
    // draw previous frame
    ctx.drawImage(canvas, 0, -10, canvas.width, canvas.height + 20)
    // darken it
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = '#EEE'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((canvas.width - width) / width)
    //
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#0fb'
    spectrum(canvas, ctx, scaledWidth, 1)
    // ctx.fillStyle = '#2d2d2d'
    ctx.fillStyle = '#000'
    spectrum(canvas, ctx, scaledWidth, 0.6)
  }
}
