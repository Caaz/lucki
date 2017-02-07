let bufferLength
let data
let ctx
let cv
let cap
let start
let last_timestamp
let dots
let lines_per
module.exports = {
  init({analyser, canvas}) {
    analyser.fftSize = 256
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    cv = canvas
    ctx = cv.getContext('2d')
    ctx.lineWidth = 0.5
    cap = data.length * 5 / 9
    start = parseInt(cap / 10, 10)
    cap -= start
    lines_per = 5
    last_timestamp = 0
    dots = []
    for (let i = 0; i < cap; i++) dots.push(new Dot((i / cap) * 360))
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    // ctx.drawImage(cv, -10, 0, cv.width + 20, cv.height)
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.save()
    ctx.translate(cv.width / 2, cv.height / 2)
    ctx.rotate(Math.PI * 3 / 2)
    const minrad = Math.min(cv.height, cv.width) / 6
    for (let i = 0; i < cap - 1; i++) {
      if (data[i + start] > dots[i].max_vol) dots[i].max_vol = data[i + start]
      else if (timestamp - last_timestamp >= 50 && dots[i].max_vol > 1) {
        dots[i].max_vol *= 0.999
        last_timestamp = timestamp
      }
      dots[i].theta = ((i + 1) / (cap)) * Math.PI * 2
      // const minrad = ellipse(dots[i].theta, cv.width / 2, cv.height / 2)
      const maxrad = ellipse(dots[i].theta, cv.width, cv.height) - minrad
      dots[i].radius = minrad + (data[i + start] / dots[i].max_vol) * maxrad
      dots[i].rect()
      dots[i].hue += 0.25
    }
    for (let i = 0; i < cap - 1; i++) {
      for (let j = 1; j < lines_per; j++) {
        const index = parseInt((j * cap / lines_per + i) % cap, 10)
        ctx.beginPath()
        // ctx.arc(dots[i].x, dots[i].y, 2, 0, 2 * Math.PI)
        ctx.moveTo(dots[i].x, dots[i].y)
        ctx.quadraticCurveTo(0, 0, dots[index].x, dots[index].y)
        const grd = ctx.createLinearGradient(dots[i].x, dots[i].y, dots[index].x, dots[index].y)
        grd.addColorStop(0, 'hsl(' + dots[i].hue + ', 100%,50%)')
        grd.addColorStop(1, 'hsl(' + dots[index].hue + ', 100%,50%)')

        ctx.strokeStyle = grd
        // ctx.strokeText(i, dots[i].x, dots[i].y)

        ctx.stroke()
        ctx.closePath()
      }
    }
    ctx.restore()
  }
}

function Dot(hue) {
  this.max_vol = 127
  this.hue = hue
  this.radius = 0
  this.theta = 0
  this.x = 0
  this.y = 0
  this.rect = function() {
    this.x = this.radius * Math.cos(this.theta)
    this.y = this.radius * Math.sin(this.theta)
  }
}

function ellipse(theta, a, b) {
  return ((a / 2) * (b / 2)) / Math.sqrt(Math.pow((b / 2) * Math.sin(theta), 2) + Math.pow((a / 2) * Math.cos(theta), 2))
}
