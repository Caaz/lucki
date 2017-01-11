const three = require('three')

let camera
let scene
let renderer
let mesh
module.exports = {
  title: 'ThreeJS test cube',
  gl: true,
  destroy() {
    camera = {}
    scene = {}
    renderer = {}
  },
  init({canvas}) {
    camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
    scene = new three.Scene()
    mesh = new three.Mesh(
      new three.BoxGeometry(200, 200, 200),
      new three.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
      }))
    renderer = new three.WebGLRenderer({canvas})
    camera.position.z = 300
    scene.add(mesh)
  },
  draw() {
    mesh.rotation.x += 0.01
    mesh.rotation.y += 0.02
    renderer.render(scene, camera)
  }
}
