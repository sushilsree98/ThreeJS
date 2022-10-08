import * as THREE from 'three'
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Camera from './Camera.js'
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import sources from './Utils/sources.js'

let instance = null

export default class Experience 
{
    constructor(canvas)
    {
        if(instance){
            return instance
        }

        instance = this
        window.experience = this;

        //Options
        this.canvas = canvas
        console.log(this.canvas)

        //Setup
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene();
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.resorces = new Resources(sources)
        this.world = new World()
        this.sizes.on('resize', ()=>
        {
            this.resize()
        })

        this.time.on('tick',()=>
        {
            this.update()
        })
    }

    resize()
    {
           this.camera.resize()
           this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
    }
}