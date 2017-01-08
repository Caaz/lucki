module.exports = {
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    analyser.getByteFrequencyData(dataArray)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const width = parseInt(bufferLength * 5 / 6, 10)
    const scaledWidth = ((canvas.width - width) / width)
    ctx.beginPath()
    ctx.moveTo(0, canvas.height)
    for(let i = 0; i < bufferLength; i++) {
      const height = canvas.height * dataArray[i] / 256
      ctx.lineTo((scaledWidth * i), canvas.height - 1 - height)
    }
    ctx.strokeStyle = '#0fb'
    ctx.lineWidth = 2
    ctx.stroke()
  }
}
