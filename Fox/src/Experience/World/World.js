import Experience from "../Experience.js";
import * as THREE from 'three'
import { MeshBasicMaterial } from "three";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Fox from "./Fox.js";

export default class World{
    constructor(){
        this.experience = new Experience()
        this.scene = this.experience.scene;
        this.resources = this.experience.resorces

        this.resources.on('ready', ()=>{
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment();
        })
        //Setup
    }

    update(){
        if(this.fox)
            this.fox.update()
    }
}