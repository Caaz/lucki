const THREE = window.THREE = require('three')
const color = require('color')
require('three/examples/js/GPUParticleSystem')
// require('three/examples/js/effects/OutlineEffect')
// Visualizer stuff
let bufferLength
let data
// Three rendering stuff.
let clock
let camera
let scene
let renderer
let particleSystem
let tick = 0
// const rate = 2
// let effect

module.exports = {
  title: 'Rainbow Road',
  gl: true,
  init({analyser, canvas}) {
    analyser.fftSize = 64
    bufferLength = analyser.frequencyBinCount
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.y = bufferLength * 3
    scene = new THREE.Scene()
    clock = new THREE.Clock(true)
    data = new Uint8Array(bufferLength)

    scene.add(new THREE.GridHelper(bufferLength))

    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 100000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle-bold.png')
    })
    scene.add(particleSystem)
    renderer = new THREE.WebGLRenderer({canvas})
    camera.lookAt(scene.position)
  },
  resize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  destroy() {
    camera = {}
    scene = {}
    renderer = {}
  },
  draw(timestamp, {analyser}) {
    camera.position.x = Math.cos(timestamp / 10000) * bufferLength * 3
    camera.position.z = Math.sin(timestamp / 10000) * bufferLength * 3
    camera.lookAt(scene.position)
    const last = Object.assign([], data)
    analyser.getByteFrequencyData(data)
    let total = 0
    for(let i = 0; i < bufferLength; i++) total += data[0]
    const rate = Math.pow((total / bufferLength) / 255, 2) * 4
    const delta = clock.getDelta() * rate
    tick += delta
    if(tick < 0) tick = 0

    if(delta > 0) {
      const options = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(0, 0, -bufferLength * 2),
        positionRandomness: 1,
        velocityRandomness: 0,
        size: 5,
        colorRandomness: 0.1,
        sizeRandomness: 1,
        lifetime: bufferLength / 2,
        color: 0xffffff
      }
      for(let i = 0; i < bufferLength; i++) {
        options.position.set(
          i - (bufferLength / 2),
          (data[i] / 256 * bufferLength / 2),
          -bufferLength)
        options.color = getHex(color({h: (i / bufferLength * 360), s: 100, l: 50}))
        const jump = Math.abs(last[i] - data[i])
        options.velocityRandomness = jump / 256 / 4
        for (let x = 0; x < 200 * delta * data[i] / 256; x++) particleSystem.spawnParticle(options)
        // console.log(jump)
        // console.log(last[i] + ' - ' + data[i])
        if(jump > 20) {
          options.velocityRandomness = 0.2
          options.size = 10
          for (let x = 0; x < 300 * delta * data[i] / 256; x++) particleSystem.spawnParticle(options)
          options.size = 5
        }
        // options.position.y = 0
        // options.size = 2
        // for (let x = 0; x < delta; x++) particleSystem.spawnParticle(options)
      }
    }
    particleSystem.update(tick)
    renderer.render(scene, camera)
  }
}
function getHex(inColor) {
  const val = []
  val.push(Math.floor(inColor.red()).toString(16))
  val.push(Math.floor(inColor.green()).toString(16))
  val.push(Math.floor(inColor.blue()).toString(16))
  for(let i = 0; i < 3; i++) val[i] = (val[i].length <= 1) ? '0' + val[i] : val[i]
  return '0x' + val.join('')
}
