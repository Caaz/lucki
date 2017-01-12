const THREE = window.THREE = require('three')
require('three/examples/js/GPUParticleSystem')

// Visualizer stuff
let bufferLength
let data
// Three rendering stuff.
let camera
let scene
let renderer
// Particle Options
let clock
// let options
let spawnerOptions
let particleSystem

module.exports = {
  title: 'Hobo Stove',
  gl: true,
  init({canvas, analyser}) {
    analyser.fftSize = 128
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)

    clock = new THREE.Clock(true)
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.y = 20
    scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
    })
    spawnerOptions = {
      spawnRate: 1000,
      timeScale: 10
    }

    // scene.add(new THREE.AxisHelper(20))
    scene.add(particleSystem)
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    camera.position.x = Math.cos(timestamp / 2000) * 50
    camera.position.z = Math.sin(timestamp / 2000) * 50
    camera.lookAt(scene.position)

    const delta = clock.getDelta() * spawnerOptions.timeScale
    const tick = timestamp / 2000 * spawnerOptions.timeScale
    if (delta > 0) {
      for(let i = 0; i < bufferLength; i++) {
        const options = {
          position: new THREE.Vector3(),
          positionRandomness: 0.5,
          velocity: new THREE.Vector3(0, data[i] / 256, 0),
          velocityRandomness: 0,
          lifetime: 2,
          size: 30,
          color: 0xffffff,
          colorRandomness: 0.2
        }
        options.position.x = Math.cos(i / bufferLength * Math.PI * 2) * 20
        options.position.z = Math.sin(i / bufferLength * Math.PI * 2) * 20
        for (let x = 0; x < spawnerOptions.spawnRate * delta * (data[i] / 256) / 2; x++) {
          particleSystem.spawnParticle(options)
        }
        options.color = 0xff9900
        // options.size = 15
        options.positionRandomness = 1
        for (let x = 0; x < spawnerOptions.spawnRate * delta * (data[i] / 256 / 1.5) / 2; x++) {
          particleSystem.spawnParticle(options)
        }
        options.color = 0xAA0000
        // options.size = 20
        options.positionRandomness = 1.2
        options.velocity = new THREE.Vector3(0, data[i] / 256 / 2, 0)
        for (let x = 0; x < spawnerOptions.spawnRate * delta * (data[i] / 256); x++) {
          particleSystem.spawnParticle(options)
        }
      }
    }
    particleSystem.update(tick)
    renderer.render(scene, camera)
  },
  resize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  destroy() {
    // not sure how important this is or if it even works.
    camera = {}
    scene = {}
    renderer = {}
    particleSystem = {}
    spawnerOptions = {}
    clock = {}
  }
}
