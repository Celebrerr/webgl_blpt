import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { lerp } from '../Utils/helpers';

import Canvas from '../Canvas';

export default class Container {
    constructor() {
        this.element = new Canvas();

        this.scene = this.element.scene;
        this.time = this.element.time;
        this.sizes = this.element.sizes;

        this.clock = new THREE.Clock();

        this.axes = {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        };

        this.settings = {
            material: 'physical',
            light: true,
        };

        if (this.settings.light) this.initLight();
        this.initGeometry();
        // this.initTexture();
        this.initPhysicalMaterial();
        this.initMesh();
        this.addEventListener();
    }

    initLight() {
        this.sphere = new THREE.SphereGeometry(0, 16, 10);

        this.light = {
            colorMid: 0xffffff,
            colorTl: 0xffffff,
            colorBr: 0xffffff,
        };

        this.lightMid = new THREE.PointLight(this.light.colorMid, 3, 55);
        this.lightMid.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorMid })));
        this.lightMid.position.set(0.1, 50, 0);

        this.lightTl = new THREE.PointLight(this.light.colorTl, 3, 55);
        this.lightTl.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorTl })));
        this.lightTl.position.set(-50, 12, 0.5);

        this.lightBr = new THREE.PointLight(this.light.colorBr, 3, 55);
        this.lightBr.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorBr })));
        this.lightBr.position.set(50, -12, 0.5);

        this.scene.add(this.lightMid);
        this.scene.add(this.lightTl);
        this.scene.add(this.lightBr);
    }

    initTexture() {
        this.HDR = new RGBELoader().load('environmentMap/empty_warehouse_01_2k.hdr', () => {
            this.HDR.mapping = THREE.EquirectangularReflectionMapping;
        });
    }

    initGeometry() {
        // this.geometry = new THREE.IcosahedronBufferGeometry(30, 0);
        // this.geometry = new THREE.SphereBufferGeometry(30, 30, 30);

        this.geometry = new THREE.CylinderBufferGeometry(15, 15, 50, 5);
    }

    initBasicMaterial() {
        this.material = new THREE.MeshBasicMaterial({
            color: 0xfff,
        });
    }

    initPhysicalMaterial() {
        this.material = new THREE.MeshPhysicalMaterial({
            metalness: 0.0,
            roughness: 0.0,
            reflectivity: 1.0,

            transmission: 0.8,
            thickness: 1.0,

            envMap: this.HDR,
        });
    }

    initMatcapMaterial() {
        this.material = new THREE.MeshMatcapMaterial();
        this.material.matcap = this.matcapTexture;
    }

    initShaderMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uResolution: { value: new THREE.Vector2(0.235, 0.41) },
                uPink: { value: true },

                uTime: { value: 1.0 },
                uLight: { value: 1.9 },
                uColorRed: { value: 0.65 },

                uChaos: { value: 1.87 },
                uDeform: { value: 4.5 },
                uZoom: { value: 1.0 },

                uSpectral: { value: false },
            },
        });
    }

    initPhongMaterial() {}

    initMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(1, 1, 1);

        this.scene.add(this.mesh);
    }

    onMouseMove(event) {
        this.axes.x = event.clientX / this.sizes.width - 0.5;
        this.axes.y = event.clientY / this.sizes.height + 0.5;
    }
    onTouchMove(event) {
        this.axes.x = event.touches[0].clientX / this.sizes.width - 0.5;
        this.axes.y = event.touches[0].clientY / this.sizes.height + 0.5;
    }

    addEventListener() {
        if (this.sizes.width > this.sizes.height) {
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
        } else {
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
        }
    }

    update() {}
}
