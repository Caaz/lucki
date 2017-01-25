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
let spawnerOptions
let particleSystem
const trend = []
const speeds = []

module.exports = {
  title: 'Black Hole',
  gl: true,
  init({canvas, analyser}) {
    for(let i = 0; i < 10; i++) trend.push(0)
    for(let i = 0; i < 10; i++) speeds.push(0)
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
      maxParticles: 500000,
      particleNoiseTex: textureLoader.load('../assets/visualizer/perlin-neutral.png'),
      particleSpriteTex: textureLoader.load('../assets/visualizer/particle.png')
    })
    spawnerOptions = {
      spawnRate: 3000,
      timeScale: 3
    }
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 20, 10),
      new THREE.MeshToonMaterial({
        color: 0x000000,
        shininess: 1,
        specular: 0xffffff,
        reflectivity: 1
      }))
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
        positionRandomness: 0.2,
        velocityRandomness: 0.1,
        size: 10,
        colorRandomness: 0.4
      }
      for (let x = 0; x < spawnerOptions.spawnRate * delta * (smoothed / 256) / 5; x++) {
        particleSystem.spawnParticle(options)
      }
      options.velocity.y = 0
      options.color = 0x2200aa
      // Smooth Speed!
      let speed = smoothed / 256 * -timestamp / 400
      speeds.pop()
      speeds.unshift(speed)
      speed = 0
      speeds.forEach(v => {
        speed += v
      })
      speed /= speeds.length
      //
      for(let i = 0; i < bufferLength; i++) {
        const strength = Math.pow(data[i] / 256, 2)
        // options.lifetime = strength * 5
        for(let j = 0; j < 2; j++) {
          options.velocity.x = Math.cos(speed + (i / bufferLength) * 2 + (Math.PI * j))
          options.velocity.z = Math.sin(speed + (i / bufferLength) * 2 + (Math.PI * j))
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
