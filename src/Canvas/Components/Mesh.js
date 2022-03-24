import * as THREE from 'three';

import vertexShader from '../../shaders/mesh/vertex.glsl';
import fragmentShader from '../../shaders/mesh/wave.glsl';

import Canvas from '../Canvas';

export default class Mesh {
    constructor() {
        this.element = new Canvas();

        this.scene = this.element.scene;
        this.time = this.element.time;
        this.sizes = this.element.sizes;
        this.audio = this.element.audio;

        this.axes = {
            x: 0.1,
            y: 0.1,
            z: 0.1,
        };

        //?Turn on device orientation event listener
        this.orientaion = {
            on: false,
            x: 0.1,
            y: 0.1,
            z: 0.1,
        };

        // this.initTexture();
        this.initGeometry();
        this.initMaterial();
        this.initMesh();

        this.addEventListener();
    }

    initTexture() {
        this.textureLoader = new THREE.TextureLoader();
        this.texture = this.textureLoader.load('/textures/matcaps/g1.png');
    }

    initGeometry() {
        this.geometry = new THREE.PlaneBufferGeometry(30.0, 60.0);
    }

    initMaterial() {
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uResolution: { value: new THREE.Vector2(0.9, 0.45) },
                uPink: { value: false },
                uTime: { value: 1.0 },
                uLight: { value: 2.0 },
                uColorRed: { value: 0.47 },
                uChaos: { value: 1.5 },
                uDeform: { value: 5.5 },
                uZoom: { value: 0.8 },
                uSpectral: { value: false },
            },
        });
        // this.material = new THREE.MeshBasicMaterial({ color: 0xebeef1 });
        this.material.side = THREE.DoubleSide;
    }

    initMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
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

    onDeviceOrientation(e) {
        this.orientaion.x = e.gamma * 0.5;
        this.orientaion.y = e.beta * 0.05;
        this.orientaion.z = e.alpha * 0.5;
    }

    addEventListener() {
        if (this.sizes.width > this.sizes.height) {
            window.addEventListener('mousemove', this.onMouseMove.bind(this));
        } else {
            if (this.orientaion.on) {
                window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));
            }
            window.addEventListener('touchmove', this.onTouchMove.bind(this));
        }
    }

    resize() {
        this.sizes.width > this.sizes.height
            ? window.addEventListener('mousemove', this.onMouseMove.bind(this))
            : window.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    update() {
        const time = this.time.elapsed * 0.000002;

        const a = this.time.elapsed * 0.00009;
        const b = this.time.elapsed * 0.00005;
        const c = this.time.elapsed * 0.00002;

        this.material.uniforms.uTime.value = Math.sin(time);
    }
}
