const THREE = window.THREE = require('three')
const TWEEN = require('tween.js')
const detector = require('three/examples/js/Detector')
require('three/examples/js/GPUParticleSystem')

const particleLife = 100
let bufferLength
let data
let camera
let scene
let renderer

function initParticle(p, d, o) {
  const particle = this instanceof THREE.Sprite ? this : p
  const delay = d === undefined ? 0 : d
  const offset = o === undefined ? this.position.x : o
  particle.position.set(offset, 0, 0)
  particle.scale.x = particle.scale.y = Math.random() * 32 + 16
  new TWEEN.Tween(particle)
    .delay(delay)
    .to({}, particleLife)
    .onComplete(initParticle)
    .start()
  new TWEEN.Tween(particle.position)
    .delay(delay)
    .to({
      x: offset,
      y: data[particle.data.spec] / 256 * 400, // * Math.random() ,
      z: 0}, particleLife)
    .start()
  new TWEEN.Tween(particle.scale)
    .delay(delay)
    .to({x: 0.01, y: 0.01}, particleLife)
    .start()
}
module.exports = {
  init({canvas, analyser}) {
    // Analyser shit
    analyser.fftSize = 32
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)

    if(detector.webgl) console.log('We\'ve got webgl')
    else console.log('No webgl here!')
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.y = 1000
    scene = new THREE.Scene()

    const material = new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture((() => {
        const canvas = document.createElement('canvas')
        canvas.width = 16
        canvas.height = 16
        const context = canvas.getContext('2d')
        const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2)
        gradient.addColorStop(0, 'rgba(255,255,255,1)')
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)')
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)')
        gradient.addColorStop(1, 'rgba(0,0,0,1)')
        context.fillStyle = gradient
        context.fillRect(0, 0, canvas.width, canvas.height)
        return canvas
      })()),
      blending: THREE.AdditiveBlending
    })
    for(let x = 0; x < data.length; x++) {
      for (let i = 0; i < 20; i++) {
        const particle = new THREE.Sprite(material)
        particle.data = {
          spec: x
        }
        initParticle(particle, i * 100, (x - data.length / 2) * 50)
        scene.add(particle)
      }
    }
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    camera.position.x = Math.cos(timestamp / 2000) * 2000
    camera.position.z = Math.sin(timestamp / 2000) * 2000
    camera.lookAt(scene.position)
    TWEEN.update()
    renderer.render(scene, camera)
  }
}
