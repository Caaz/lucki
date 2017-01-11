const three = require('three')
const detector = require('three/examples/js/Detector')
// let bufferLength
// let data

let camera
let scene
let renderer
let geometry
let material
let mesh

module.exports = {
  title: 'ThreeJS test cube',
  init({canvas}) {
    if(detector.webgl) console.log('We\'ve got webgl')
    else console.log('No webgl here!')
    camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.z = 300
    scene = new three.Scene()
    geometry = new three.BoxGeometry(200, 200, 200)
    material = new three.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    })
    mesh = new three.Mesh(geometry, material)
    scene.add(mesh)
    renderer = new three.WebGLRenderer({canvas})
  },
  draw() {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02
    renderer.render(scene, camera)
  }
}
