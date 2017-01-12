const THREE = window.THREE = require('three')
// const dat = require('three/examples/js/libs/dat.gui.min')
require('three/examples/js/GPUParticleSystem')

// Visualizer stuff
let bufferLength
let data
// Three rendering stuff.
let camera
let scene
let renderer
// let ui
// Particle Options
let clock
// let options
let spawnerOptions
let particleSystem
const trend = []
// const lights = []
module.exports = {
  title: 'Black Hole',
  gl: true,
  init({canvas, analyser}) {
    for(let i = 0; i < 10; i++) trend.push(0)
    analyser.fftSize = 64
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    clock = new THREE.Clock(true)
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.y = 10
    camera.position.x = Math.cos(1) * 15
    camera.position.z = Math.sin(1) * 15
    scene = new THREE.Scene()
    const textureLoader = new THREE.TextureLoader()
    particleSystem = new THREE.GPUParticleSystem({
      maxParticles: 250000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
    })
    spawnerOptions = {
      spawnRate: 10000,
      timeScale: 1
    }
    // lights.push(new THREE.PointLight(0x2200aa, 1, 6))
    // lights.push(new THREE.PointLight(0x2200aa, 1, 6))
    // scene.add(lights[0])
    // scene.add(lights[1])
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 10),
      new THREE.MeshToonMaterial({
        color: 0x000000,
        shininess: 1,
        specular: 0xffffff,
        reflectivity: 1
        // wireframe: true
      }))
    // sphere.set()
    sphere.position.set(0, 0, 0)

    scene.add(particleSystem)
    scene.add(sphere)

    const starsGeometry = new THREE.Geometry()
    for (let i = 0; i < 10000; i++) {
      const star = new THREE.Vector3()
      star.x = THREE.Math.randFloatSpread(2000)
      star.y = THREE.Math.randFloatSpread(2000)
      star.z = THREE.Math.randFloatSpread(2000)
      starsGeometry.vertices.push(star)
    }

    const starsMaterial = new THREE.PointsMaterial({color: 0x888888})
    const starField = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(starField)

    renderer = new THREE.WebGLRenderer({canvas})
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  draw(timestamp, {analyser}) {
    analyser.getByteFrequencyData(data)
    camera.position.x = Math.cos(-timestamp / 2000) * 20
    camera.position.z = Math.sin(-timestamp / 2000) * 20
    // camera.position.x = Math.sin(timestamp / 2000) * 20
    // camera.position.z = Math.sin(1) * 15
    camera.lookAt(scene.position)

    const delta = clock.getDelta() * spawnerOptions.timeScale
    const tick = timestamp / 2000 * spawnerOptions.timeScale
    if (delta > 0) {
      trend.pop()
      trend.unshift(data[0])
      let smoothed = 0
      trend.forEach(v => {
        smoothed += v
      })
      smoothed /= trend.length
      const options = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(0, smoothed * ((Math.random() > 0.5) ? -1 : 1), 0),
        // positionRandomness: 0,
        velocityRandomness: 0.2,
        size: 5,
        colorRandomness: 0.4
      }
      for (let x = 0; x < spawnerOptions.spawnRate * delta * (smoothed / 256) / 2; x++) {
        particleSystem.spawnParticle(options)
      }
      options.velocity.y = 0
      options.color = 0x2200aa
      const speed = smoothed / 256 + -timestamp / 200
      for(let i = 1; i < bufferLength; i++) {
        const strength = Math.pow(data[i] / 256, 2)
        options.lifetime = strength * 2
        for(let j = 0; j < 2; j++) {
          options.position.x = Math.cos(speed + (i / bufferLength * Math.PI) + (Math.PI * j))
          options.position.z = Math.sin(speed + (i / bufferLength * Math.PI) + (Math.PI * j))
          options.velocity.x = Math.cos(speed + (i / bufferLength * Math.PI) + (Math.PI * j))
          options.velocity.z = Math.sin(speed + (i / bufferLength * Math.PI) + (Math.PI * j))
          for (let x = 0; x < spawnerOptions.spawnRate * delta * strength / 2; x++) {
            particleSystem.spawnParticle(options)
          }
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
