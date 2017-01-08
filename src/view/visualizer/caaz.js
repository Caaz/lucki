let bufferLength
let data
function spectrum(canvas, ctx, width, offset) {
  ctx.beginPath()
  ctx.moveTo(0, canvas.height + offset)
  for(let i = 0; i < bufferLength; i++) {
    const height = canvas.height * data[i] / 256
    ctx.lineTo((width * i), canvas.height - 1 - height + offset)
  }
  ctx.lineTo(canvas.width, canvas.height + offset)
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
    ctx.drawImage(canvas, 0, -1, canvas.width, canvas.height)
    // darken it
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((canvas.width - width) / width)
    //
    ctx.fillStyle = '#0fb'
    spectrum(canvas, ctx, scaledWidth, 0)
    ctx.fillStyle = '#2d2d2d'
    spectrum(canvas, ctx, scaledWidth, canvas.height / 10)
  }
}
