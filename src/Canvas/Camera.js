import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Canvas from './Canvas';

export default class Camera {
    constructor() {
        this.element = new Canvas();

        this.time = this.element.time;

        this.canvas = this.element.canvas;
        this.sizes = this.element.sizes;
        this.scene = this.element.scene;
        this.mesh = this.element.mesh;
        this.model = this.element.model;

        this.initInstance();
        this.initOrbitControls();
    }

    initInstance() {
        this.instance = new THREE.PerspectiveCamera(25, this.sizes.width / this.sizes.height, 0.2, 1000);
        this.instance.position.set(0, 0, 180);

        this.scene.add(this.instance);
    }

    initOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);

        this.controls.enableDamping = true;
        this.controls.enablePan = true;
        this.controls.autoRotate = false;

        // this.controls.minPolarAngle = 1.0;
        // this.controls.maxPolarAngle = 2.0;
        // this.controls.minAzimuthAngle = -Math.PI / 1.5;
        // this.controls.maxAzimuthAngle = Math.PI / 1.5;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update();
        if (this.controls.autoRotate) this.controls.autoRotateSpeed = 1;
        this.controls.dampingFactor = 0.05;

        // this.instance.lookAt(this.model.obj.position);
    }
}
