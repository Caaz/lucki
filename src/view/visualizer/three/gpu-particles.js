const THREE = window.THREE = require('three')
require('three/examples/js/GPUParticleSystem')

let camera
let tick = 0
let scene
let renderer
const clock = new THREE.Clock(true)
let options
let spawnerOptions
let particleSystem

module.exports = {
  title: 'Fancy Particles',
  gl: true,
  init({canvas}) {
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 100
    scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
    })
    scene.add(particleSystem)
    options = {
      position: new THREE.Vector3(),
      positionRandomness: 0.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.8,
      color: 0xaa88ff,
      colorRandomness: 0.2,
      turbulence: 0.2,
      lifetime: 2,
      size: 5,
      sizeRandomness: 1
    }
    spawnerOptions = {
      spawnRate: 15000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 0.6
    }
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  draw() {
    const delta = clock.getDelta() * spawnerOptions.timeScale
    tick += delta
    if (tick < 0) tick = 0
    if (delta > 0) {
      options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20
      options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10
      options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5
      for (let x = 0; x < spawnerOptions.spawnRate * delta; x++) {
        // Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
        // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
        particleSystem.spawnParticle(options)
      }
    }
    particleSystem.update(tick)
    renderer.render(scene, camera)
  }
}
