module.exports = {
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)

    // const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
    ctx.drawImage(canvas, 0, -1, canvas.width, canvas.height)
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(0,0,0,0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((canvas.width - width) / width)
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    for(let i = 0; i < bufferLength; i++) {
      const height = canvas.height * dataArray[i] / 256
      ctx.lineTo((scaledWidth * i), canvas.height - 1 - height)
    }
    ctx.lineTo(canvas.width, canvas.height)
    // ctx.strokeStyle = '#0fb'
    ctx.fillStyle = '#0fb'
    // ctx.fillStyle = '#2d2d2d'
    // ctx.lineWidth = 10
    // ctx.stroke()
    ctx.fill()
  }
}
