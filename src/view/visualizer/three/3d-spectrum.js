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

let bars = []

module.exports = {
  gl: true,
  init({analyser, canvas}) {
    analyser.fftSize = 64
    bufferLength = analyser.frequencyBinCount
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.y = bufferLength * 3
    scene = new THREE.Scene()
    clock = new THREE.Clock(true)
    data = []
    for(let i = 0; i < bufferLength; i++) {
      data.push(new Uint8Array(bufferLength))
      bars.push([])
      for(let j = 0; j < bufferLength; j++) {
        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshToonMaterial({color: color({h: (j / bufferLength * 360), s: 100, l: 50}).string()})
        )
        cube.position.set(i - bufferLength / 2, 0, j - bufferLength / 2)
        bars[i].push(cube)
        scene.add(cube)
      }
    }
    // scene.add(new THREE.AmbientLight(0x404040))
    scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1))
    // const floor = new THREE.Mesh(
    //     new THREE.PlaneGeometry(200, 200),
    //     new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide})
    // )
    // // 0x2d2d2d
    // floor.rotateX(Math.PI / 2)
    // floor.position.y = 0.02
    // scene.add(floor)

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
    // for(let i = 0; i < bufferLength; i++) bars[i].geometry.dispose()
    bars = []
    camera = {}
    scene = {}
    renderer = {}
  },
  draw(timestamp, {analyser}) {
    camera.position.x = Math.cos(timestamp / 2000) * 2 * bufferLength
    camera.position.z = Math.sin(timestamp / 2000) * 2 * bufferLength
    camera.lookAt(scene.position)

    data.unshift(new Uint8Array(bufferLength))
    const ghost = data.pop()
    const delta = clock.getDelta()
    const tick = timestamp / 100
    if(delta > 0) {
      const options = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        positionRandomness: 1,
        velocityRandomness: 0,
        size: 5,
        colorRandomness: 0.1,
        sizeRandomness: 1,
        lifetime: 10,
        color: 0xffffff
      }
      for(let i = 0; i < bufferLength; i++) {
        if(ghost[i] !== 0) {
          options.position.set(
            bufferLength / 2 - 1,
            (ghost[i] / 256 * bufferLength / 2),
            i - bufferLength / 2)
          options.velocity.x = 0.5
          options.color = getHex(color({h: (i / bufferLength * 360), s: 100, l: 50}))
          if(i === 20) {
            // 20 = 0x003fff
            // For some reason it's not rendering this color specifically.
            // console.log(options.color)
            // options.color = 0xffffff
            // console.lo
          }
          for (let x = 0; x < 10000 * delta * ghost[i] / 256; x++) {
            particleSystem.spawnParticle(options)
          }
        }
      }
    }
    particleSystem.update(tick)

    analyser.getByteFrequencyData(data[0])
    for(let i = 0; i < bufferLength; i++) {
      for(let j = 0; j < bufferLength; j++) {
        const height = 0.01 + data[i][j] / 256 * bufferLength / 2
        bars[i][j].scale.y = height
        bars[i][j].position.y = height / 2
      }
    }
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
