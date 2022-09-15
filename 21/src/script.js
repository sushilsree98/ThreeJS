import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import { BufferGeometry } from 'three'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor').onChange(event=>{
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const textureLoader = new THREE.TextureLoader()
const gradient = textureLoader.load('/textures/gradients/3.jpg')
gradient.magFilter = THREE.NearestFilter

const material = new THREE.MeshToonMaterial({gradientMap:gradient})

const objectsDistance = 4 
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

const sectionMeshes = [ mesh1, mesh2, mesh3 ]

scene.add(mesh1, mesh2, mesh3)

/**
 * Particles
 */

const particleCount = 200;
const particlePosition = new Float32Array(particleCount * 3)

for(let i = 0; i < particleCount; i++){
    particlePosition[i * 3 + 0] = (Math.random() - 0.5) * 10
    particlePosition[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * 3
    particlePosition[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particleGeometry = new THREE.BufferGeometry()
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePosition,3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

// Points
const particles = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(particles)

//Light
const directionLight = new THREE.DirectionalLight('#ffffff', 1)
directionLight.position.set(1, 1, 0)
scene.add(directionLight)

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
 * Group
 */

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true,
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener('scroll', ()=>{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY/sizes.height)
    console.log(newSection)
    if(newSection != currentSection){
        currentSection = newSection
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0;
cursor.y = 0;

window.addEventListener('mousemove', (event)=>{
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Animate
 */
const clock = new THREE.Clock()
let prevTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - prevTime
    prevTime = elapsedTime


    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += delta * 0.1
        mesh.rotation.y += delta * 0.12
    }

    camera.position.y = -scrollY/sizes.height * objectsDistance
    mesh1.position.x = 1;
    mesh2.position.x = -1;
    mesh3.position.x = 1

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * delta
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * delta
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()