let bufferLength
let data
let ctx
let cv
let cap
let max_vols
let last_timestamp
module.exports = {
  init({analyser, canvas}) {
    analyser.fftSize = 1024
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    cv = canvas
    ctx = cv.getContext('2d')
    cap = data.length * 5 / 6
    last_timestamp = 0
    max_vols = []
    for (let i = 0; i < cap; i++) max_vols.push(127)
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    // ctx.drawImage(cv, -10, 0, cv.width + 20, cv.height)
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.save()
    ctx.translate(cv.width / 2, cv.height / 2)
    ctx.rotate(Math.PI)
    for (let i = 0; i < cap; i++) {
      if (data[i] > max_vols[i]) max_vols[i] = data[i]
      else if (timestamp - last_timestamp >= 50 && max_vols[i] > 1) {
        max_vols[i] *= 0.95
        last_timestamp = timestamp
      }
      ctx.rotate(Math.PI * 2 / cap)
      const theta = (i / cap) * Math.PI * 2
      const minrad = ellipse(theta, cv.width / 2, cv.height / 2)
      const maxrad = ellipse(theta, cv.width, cv.height) - minrad
      ctx.beginPath()
      const color = (i / cap) * 360 - timestamp / 20
      ctx.fillStyle = 'hsl(' + color + ', 100%,50%)'
      ctx.fillStyle = ''
      const radius = minrad + (data[i] / max_vols[i]) * maxrad
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
