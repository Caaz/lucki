const THREE = window.THREE = require('three')
// require('three/examples/js/effects/OutlineEffect')
// Visualizer stuff
let bufferLength
let data
// Three rendering stuff.
let camera
let scene
let renderer
// let effect

let bars = []

module.exports = {
  gl: true,
  init({analyser, canvas}) {
    analyser.fftSize = 32
    bufferLength = analyser.frequencyBinCount
    data = new Uint8Array(bufferLength)
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = -30
    camera.position.y = 50
    // console.log(bufferLength)
    scene = new THREE.Scene()
    for(let i = 0; i < bufferLength; i++) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshToonMaterial({color: 'rgb(' + hslToRgb(i / bufferLength, 1, 0.5).join(',') + ')'}))
      cube.position.set(i * 2 - bufferLength, 0, 0)
      bars.push(cube)
      scene.add(cube)
    }
    scene.add(new THREE.AmbientLight(0x404040))
    scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1))
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({color: 0x2d2d2d, side: THREE.DoubleSide})
    )
    floor.rotateX(Math.PI / 2)
    // floor.ro
    scene.add(floor)

    renderer = new THREE.WebGLRenderer({canvas})
    // effect = new THREE.OutlineEffect(renderer, {defaultThickness: 0.01})
    camera.lookAt(scene.position)
  },
  resize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  },
  destroy() {
    for(let i = 0; i < bufferLength; i++) bars[i].geometry.dispose()
    bars = []
    camera = {}
    scene = {}
    renderer = {}
  },
  draw(timestamp, {analyser}) {
    camera.position.x = Math.cos(timestamp / 2000) * 50
    camera.position.z = Math.sin(timestamp / 2000) * 50
    camera.lookAt(scene.position)
    analyser.getByteFrequencyData(data)
    for(let i = 0; i < bufferLength; i++) {
      const strength = Math.pow(data[i] / 256, 2)
      const height = 0.001 + strength * 10
      bars[i].scale.y = height
      bars[i].position.y = height / 2
    }
    renderer.render(scene, camera)
  }
}

function hslToRgb(h, s, l) {
  let r
  let g
  let b
  if(s === 0) r = g = b = l
  else {
    const hue2rgb = function hue2rgb(p, q, t) {
      if(t < 0) t += 1
      if(t > 1) t -= 1
      if(t < 1 / 6) return p + (q - p) * 6 * t
      if(t < 1 / 2) return q
      if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
