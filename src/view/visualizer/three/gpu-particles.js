const THREE = window.THREE = require('three')
// const TWEEN = require('tween.js')
require('three/examples/js/GPUParticleSystem')

let camera
let tick = 0
let scene
let renderer
const clock = new THREE.Clock(true)
// let controls
// let container
// const gui = new dat.GUI()
let options
let spawnerOptions
let particleSystem

module.exports = {
  title: 'Fancy Particles',
  gl: true,
  init({canvas}) {
    // container = document.createElement('div')
    // document.body.appendChild(container)
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 100
    scene = new THREE.Scene()
    // The GPU Particle system extends THREE.Object3D, and so you can use it
    // as you would any other scene graph component.  Particle positions will be
    // relative to the position of the particle system, but you will probably only need one
    // system for your whole scene

    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
    })
    scene.add(particleSystem)
    // options passed during each spawned
    options = {
      position: new THREE.Vector3(),
      positionRandomness: 0.3,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.5,
      color: 0xaa88ff,
      colorRandomness: 0.2,
      turbulence: 0.5,
      lifetime: 2,
      size: 5,
      sizeRandomness: 1
    }
    spawnerOptions = {
      spawnRate: 15000,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 1
    }
    // gui.add(options, 'velocityRandomness', 0, 3)
    // gui.add(options, 'positionRandomness', 0, 3)
    // gui.add(options, 'size', 1, 20)
    // gui.add(options, 'sizeRandomness', 0, 25)
    // gui.add(options, 'colorRandomness', 0, 1)
    // gui.add(options, 'lifetime', 0.1, 10)
    // gui.add(options, 'turbulence', 0, 1)
    // gui.add(spawnerOptions, 'spawnRate', 10, 30000)
    // gui.add(spawnerOptions, 'timeScale', -1, 1)
    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // container.appendChild(renderer.domElement)
    // setup controls
    // controls = new THREE.TrackballControls(camera, renderer.domElement)
    // controls.rotateSpeed = 5.0
    // controls.zoomSpeed = 2.2
    // controls.panSpeed = 1
    // controls.dynamicDampingFactor = 0.3
  },
  draw() {
    // controls.update()
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
