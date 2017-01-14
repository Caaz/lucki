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

    // scene.add(new THREE.GridHelper(100))

    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 100000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
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

    analyser.getByteFrequencyData(data)
    // const ghost = data
    const delta = clock.getDelta()
    const tick = timestamp / 100
    if(delta > 0) {
      const options = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        positionRandomness: 1,
        velocityRandomness: 0.001,
        size: 10,
        colorRandomness: 0.5,
        sizeRandomness: 1,
        lifetime: 50,
        color: 0xffffff
      }
      for(let i = 0; i < bufferLength; i++) {
        options.position.set(
          i - (bufferLength / 2),
          (data[i] / 256 * bufferLength / 2),
          -bufferLength)
        options.velocity.z = 0.5
        options.color = getHex(color({h: (i / bufferLength * 360), s: 100, l: 50}))
        for (let x = 0; x < 1000 * delta * data[i] / 256; x++) {
          particleSystem.spawnParticle(options)
        }
        options.position.y = 0
        for (let x = 0; x < 100 * delta; x++) {
          particleSystem.spawnParticle(options)
        }
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
