let bufferLength
let data
let ctx
let cv
let cap
module.exports = {
  init({analyser, canvas}) {
    analyser.fftSize = 2048
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    cv = canvas
    ctx = cv.getContext('2d')
    cap = data.length * 5 / 6
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    // ctx.drawImage(cv, -10, 0, cv.width + 20, cv.height)
    ctx.fillStyle = '#888'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.save()
    ctx.translate(cv.width / 2, cv.height / 2)
    ctx.rotate(Math.PI)
    for (let i = 0; i < cap; i++) {
      ctx.rotate(Math.PI * 2 / cap)
      const theta = (i / cap) * Math.PI * 2
      const minrad = ellipse(theta, cv.width / 2, cv.height / 2)
      const maxrad = ellipse(theta, cv.width, cv.height) - minrad
      ctx.beginPath()
      const color = (i / cap) * 360 - timestamp/20
      ctx.fillStyle = 'hsl(' + color + ', 100%,50%)'
      ctx.fillStyle = ''
      const radius = minrad + (data[i] / 256) * maxrad
      ctx.arc(0, radius, 2, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }
    ctx.restore()
  }
}

function Dot(x, y, hsl) {
  this.x = x
  this.y = y
  this.hsl = hsl
}

function ellipse(theta, a, b) {
  return ((a / 2) * (b / 2)) / Math.sqrt(Math.pow((b / 2) * Math.sin(theta), 2) + Math.pow((a / 2) * Math.cos(theta), 2))
}
