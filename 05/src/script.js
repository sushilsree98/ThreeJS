import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const group = new THREE.Group();

scene.add(group)
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'red'})
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'blue'})
)

group.add(cube2)
cube2.position.x = -2

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color:'green'})
)

group.add(cube3)
cube3.position.x = 2

group.position.y = 1
group.scale.y = 2
group.rotation.y = 1



/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

//Position
// mesh.position.x = 0.69;
// mesh.position.y = -0.25;
// mesh.position.z = 1;
// console.log(mesh.position.length())
// mesh.position.set(0.7, -0.6, 1)

//scale
// mesh.scale.x = 2;
// mesh.scale.y = 0.5; 
// mesh.scale.z = 0.3
// mesh.scale.set(2, 0.5, 0.3)

//rotate
// mesh.rotation.reorder("YXZ")
// mesh.rotation.x = Math.PI  * 0.25
// mesh.rotation.y = Math.PI  * 0.25


// scene.add(mesh)

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
camera.position.y = 0
camera.position.x = 0
scene.add(camera)

// camera.lookAt(mesh.position)
// console.log(mesh.position.distanceTo(camera.position))

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)