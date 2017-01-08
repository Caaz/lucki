let bufferLength
let data
module.exports = {
  init({analyser}) {
    analyser.fftSize = 256
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
  },
  draw(timestamp, {analyser, canvas, ctx}) {
    analyser.getByteFrequencyData(data)
    ctx.lineWidth = 1
    // const sliceWidth = canvas.width / (bufferLength - 1)
    ctx.fillStyle = 'rgb(34, 34, 34)'
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    const sliceWidth = canvas.width / bufferLength
    let x = 0
    let avg = 0

    for(let i = 0; i < bufferLength; i++) {
      let v = data[i] / 128
      if (data[i] > avg) avg = data[i]
      v *= canvas.height / 2

      if(i === 0) ctx.moveTo(x, v)
      else ctx.lineTo(x, v)
      x += sliceWidth
    }
    console.log(avg)
    ctx.lineTo(canvas.width, canvas.height / 2)
    ctx.stroke()
  }
}

//   oscilliscope() {
//     analyser.fftSize = 2048 * 4
//     const bufferLength = analyser.frequencyBinCount
//     const data = new Uint8Array(bufferLength)
//     analyser.getByteTimeDomainData(data)
// const dim = Math.min(canvas.width, canvas.height)
// ctx.lineWidth = 1 / 600 * dim
// const sliceWidth = dim / (bufferLength - 1)
//
// ctx.fillStyle = 'rgb(34, 34, 34)'
//     ctx.fillRect(0, 0, canvas.width, canvas.height)
//
// ctx.beginPath()
// // ctx.moveTo(0,-canvas.height/2);
// ctx.save()
// ctx.translate((canvas.width - dim) / 2, -canvas.height / 2)
//
// // ctx.fillStyle = 'rgb(45, 45, 45)'
// // ctx.arc(dim / 2, canvas.height, dim / 2, 0, Math.PI * 2)
// // ctx.fill()
// // ctx.closePath()
//
// // ctx.beginPath()
// for (let i = 0; i < bufferLength; i++) ctx.lineTo(sliceWidth * i, data[i] / 128 * canvas.height)
// ctx.restore()
// // ctx.translate(canvas.width / 2, canvas.height / 2)
// // ctx.rotate(1 * Number(Math.PI) / 180)
// // ctx.translate(-canvas.width / 2, -canvas.height / 2)
// ctx.strokeStyle = 'rgb(0, 255, 187)'
//
// ctx.stroke()
//     nextFrame()
//   }
//   // //
