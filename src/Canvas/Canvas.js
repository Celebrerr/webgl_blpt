import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';

import Container from './Components/Container';
import Gltf from './Components/Gltf';
import Mesh from './Components/Mesh';

import Camera from './Camera';
import Renderer from './Renderer';
import Gui from './Utils/Gui';

export default class Canvas {
    static instance;

    constructor(el) {
        this.canvas = el;
        this.body = document.querySelector('body');

        if (Canvas.instance) {
            return Canvas.instance;
        }
        Canvas.instance = this;

        this.sizes = new Sizes();
        this.time = new Time();

        this.scene = new THREE.Scene();

        // this.container = new Container();
        // this.gltf = new Gltf();
        this.mesh = new Mesh();

        this.camera = new Camera();
        this.renderer = new Renderer();

        // this.gui = new Gui();

        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
        });

        // this.initStats();
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    initStats() {
        this.stats = new Stats();
        this.body.appendChild(this.stats.dom);
    }

    update() {
        this.camera.update();
        this.renderer.update();

        //? Get update to...
        if (this.container) this.container.update();
        if (this.gltf) this.gltf.update();
        if (this.mesh) this.mesh.update();

        if (this.stats) this.stats.update();
    }
}
