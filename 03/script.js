//Scene
const scene = new THREE.Scene()

//Mesh
const geometry = new THREE.BoxGeometry(1,1,0)
const material = new THREE.MeshBasicMaterial({ color:'red' })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

//Camera
const sizes = {
    width:700,
    height:800
}
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height)
camera.position.z = 3
scene.add(camera)

//Renderer
const canvas = document.querySelector('canvas.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas : canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)