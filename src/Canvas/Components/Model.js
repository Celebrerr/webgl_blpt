import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import vertexShader from '../../shaders/mesh/vertex.glsl';
import fragmentShader from '../../shaders/mesh/reddy.glsl';

import { lerp } from '../Utils/helpers';

import Canvas from '../Canvas';

export default class Model {
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
            material: 'matcap',
            light: true,
            helpers: false,
        };

        this.lerp = {
            cZoom: 10.0,
            tZoom: 0.0,

            cColor: 0.43,
            tColor: 2.0,

            cLight: 0.43,
            tLight: 2.0,

            cChaos: 0.43,
            tChaos: 1.0,

            cTime: 0.0000007,
            tTime: 0.000007,

            ease: 0.06,
        };

        if (this.settings.light) this.initLight();
        this.initTexture();

        switch (this.settings.material) {
            case 'matcap':
                this.initMatcapMaterial();
                break;
            case 'physical':
                this.initPhysicalMaterial();
                break;
            case 'shader':
                this.initShaderMaterial();
                break;
            default:
                this.initBasicMaterial();
        }

        this.init3D();
        if (this.settings.helpers) this.initHelpers();
        this.addEventListener();
    }

    initLight() {
        this.sphere = new THREE.SphereGeometry(0, 16, 10);

        this.light = {
            colorMid: 0xffffff,
            colorTl: 0xffffff,
            colorBr: 0xffffff,
        };

        this.lightMid = new THREE.PointLight(this.light.colorMid, 1, 50);
        this.lightMid.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorMid })));
        this.lightMid.position.set(0.1, 0.5, 0.5);

        this.lightTl = new THREE.PointLight(this.light.colorTl, 2, 50);
        this.lightTl.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorTl })));
        this.lightTl.position.set(-10, 12, 0.5);

        this.lightBr = new THREE.PointLight(this.light.colorBr, 2, 50);
        this.lightBr.add(new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({ color: this.light.colorBr })));
        this.lightBr.position.set(10, -12, 0.5);

        this.scene.add(this.lightMid);
        this.scene.add(this.lightTl);
        this.scene.add(this.lightBr);
    }

    initTexture() {
        const loadingManager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(loadingManager);

        if (this.settings.material == 'matcap') {
            this.matcapTexture = this.textureLoader.load('textures/matcaps/custom2.png');
        }

        // this.HDR = new RGBELoader().load('environmentMap/empty_warehouse_01_2k.hdr', () => {
        //     this.HDR.mapping = THREE.EquirectangularReflectionMapping;
        // });
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

            transmission: 0.83,
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

    init3D() {
        this.gltf = new GLTFLoader().setPath('objects/');
        this.obj;

        this.gltf.load(
            'cozmo.glb',
            (gltf) => {
                this.obj = gltf.scene;
                this.obj.position.set(1, -4, 1);
                this.obj.scale.set(0.35, 0.35, 0.35);

                if (this.settings.material) {
                    this.obj.traverse((el) => {
                        el.material = this.material;
                    });
                }

                this.scene.add(this.obj);
            },
            undefined,
            (error) => {
                console.error(error);
            }
        );
    }

    initHelpers() {
        this.helper = new THREE.AxesHelper(5, 5);
        this.scene.add(this.helper);
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

    update(scroll) {
        const time = this.time.elapsed * 0.0002;
        const delta = this.clock.getDelta();

        const a = this.time.elapsed * 0.00009;
        const b = this.time.elapsed * 0.00005;
        const c = this.time.elapsed * 0.00002;

        if (this.obj) {
            // this.obj.rotation.y += 0.2 * delta;
            this.obj.rotation.y = scroll.target * 0.2;
            // this.obj.rotation.y = Math.sin(time) * 0.2;
        }

        if (this.settings.material == 'shader') {
            const time = this.time.elapsed * 0.0000025;

            const a = this.time.elapsed * 0.000009;
            const b = this.time.elapsed * 0.000005;
            const c = this.time.elapsed * 0.00002;

            this.lerp.cZoom = lerp(this.lerp.cZoom, this.lerp.tZoom, 0.1);
            this.lerp.tZoom = this.axes.x * 0.1;

            this.lerp.cTime = lerp(this.lerp.cTime, this.lerp.tTime, 0.01);
            this.lerp.tTime = this.axes.x * 0.05;

            this.lerp.cColor = lerp(this.lerp.cColor, this.lerp.tColor, 0.01);
            this.lerp.tColor = Math.sin(c) * 20;
            this.lerp.tColor = this.axes.x * 1;

            this.lerp.cLight = lerp(this.lerp.cLight, this.lerp.tLight, 0.001);
            this.lerp.tLight = this.axes.x + 1;

            this.lerp.cChaos = lerp(this.lerp.cChaos, this.lerp.tChaos, 0.01);
            this.lerp.tChaos = (Math.cos(a) / Math.sin(b)) * 0.5;
            this.lerp.tChaos = this.axes.x * 5;

            this.material.uniforms.uTime.value = this.lerp.cTime;
            // this.material.uniforms.uZoom.value = this.lerp.cZoom;
            this.material.uniforms.uChaos.value = this.lerp.cChaos;
            // this.material.uniforms.uLight.value = this.lerp.cLight;
        }
    }
}
