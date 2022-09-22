import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import CANNON from 'cannon';

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};
debugObject.createBall = () =>{
    createSphere(
        0.5, 
        {
            x:(Math.random() - 0.5) * 3,
            y:3, 
            z:(Math.random() - 0.5) * 3
        }
        )
}

debugObject.reset = () => {
    console.log('reset')
    for(let object of objectsToUpdate){
        world.removeEventListener('collide', hitSound)
        world.removeBody(object.body)

        scene.remove(object.mesh)
    }
    objectsToUpdate.splice(0, objectsToUpdate.length)
}

gui.add(debugObject, 'createBall')
gui.add(debugObject,'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) =>{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5){
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

//Material
const plasticMaterial = new CANNON.Material('Plastic')
const concreteMaterial = new CANNON.Material('Concrete')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    plasticMaterial,
    concreteMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)

world.addContactMaterial(concretePlasticContactMaterial)



const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.material = concreteMaterial
floorBody.mass = 0;
floorBody.addShape(floorShape);
world.addBody(floorBody)

floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
/**
 * Test sphere
 */
const objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5
        })
function createSphere(radius, position){
    const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial)
    sphere.scale.set(radius, radius, radius)
    sphere.castShadow = true
    sphere.position.copy(position)
    scene.add(sphere)
    
    const sphereShape = new CANNON.Sphere(radius)
    const sphereBody = new CANNON.Body({
        mass:1,
        shape: sphereShape,
        material: plasticMaterial
    })
    sphereBody.position.copy(position)
    sphereBody.addEventListener('collide',playHitSound)
    world.addBody(sphereBody)

    //Save in object to update
    objectsToUpdate.push({
        mesh : sphere,
        body: sphereBody
    })

}

createSphere(0.5, {x:0, y:3, z:0})
console.log(objectsToUpdate)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime

    //Update Physics
    world.step(1/60, deltaTime, 3)
    
    for(const object of objectsToUpdate){
        object.mesh.position.copy(object.body.position)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()