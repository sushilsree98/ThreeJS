import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'

/**
 * Base
 */

const parameters = {
    color : 0xff0000,
    spin : () =>{
        gsap.to(mesh.rotation,{duration:1, y: mesh.rotation.y + 10})
    },
    Axes : false
}

//Debug
const gui = new dat.GUI({width:300})
window.addEventListener('keydown',(event)=>{
    if(event.key == 'h')
    {
        if(gui._hidden){
            gui.show()
        }else{
            gui.hide()
        }
    }
})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const axesHelper = new THREE.AxesHelper()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parameters.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Debug
gui.add(mesh.position, 'y',-2,2,0.01)
    .name('Red cube Y')
gui.add(mesh.position, 'x',-2,2,0.01)
    .name('Red cube X')
gui.add(mesh.position, 'z')
    .name('Red cube Z')
    .min(-2)
    .max(2)
    .step(0.01)
gui.add(mesh,'visible')
gui.add(material,'wireframe')
gui.addColor(parameters,'color')
    .onChange(()=>{
        mesh.material.color.set(parameters.color)
    })
gui.add(parameters,'Axes')
    .onChange((event)=>{
        if(event){
            scene.add(axesHelper)
        }else{
            scene.remove(axesHelper)
        }
    })
gui.add(parameters,'spin')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()