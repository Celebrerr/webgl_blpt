import * as THREE from 'three';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { BleachBypassShader } from 'three/examples/jsm/shaders/BleachBypassShader.js';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';

import Canvas from './Canvas';

export default class Renderer {
    constructor() {
        this.element = new Canvas();

        this.canvas = this.element.canvas;
        this.sizes = this.element.sizes;
        this.scene = this.element.scene;
        this.camera = this.element.camera;

        this.enableComposer = true;

        this.effects = {
            isGammaCorrection: false,
            isEffectFilm: true,
            isEffectBleach: false,
            isBloom: false,
        };

        this.params = {
            exposure: 0.5,
            bloomStrength: 0.1,
            bloomThreshold: 0.6,
            bloomRadius: 0.5,
        };

        this.colors = {
            black: 0x38343a,
            white: 0xebeef1,
            lilla: 0xd4d7f7,
            yellow: 0xffc700,
        };

        this.initInstance();
        this.initComposer();
        this.initFog();
    }

    initInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });

        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio));
        this.instance.setClearColor(this.colors.black);
    }

    initComposer() {
        this.renderScene = new RenderPass(this.scene, this.camera.instance);

        const gammaCorrection = new ShaderPass(GammaCorrectionShader);
        const effectFilm = new FilmPass(0.1, 0.025, 648, false);

        const shaderBleach = BleachBypassShader;
        const effectBleach = new ShaderPass(shaderBleach);
        effectBleach.uniforms['opacity'].value = 1.0;

        // const FXAAShader = FXAAShader;
        // const effectFXAA = new ShaderPass(FXAAShader);
        // effectFXAA.enabled = true;

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height));
        bloomPass.threshold = this.params.bloomThreshold;
        bloomPass.strength = this.params.bloomStrength;
        bloomPass.radius = this.params.bloomRadius;

        this.composer = new EffectComposer(this.instance);
        this.composer.addPass(this.renderScene);

        if (this.effects.isBloom) {
            this.composer.addPass(bloomPass);
        }
        if (this.effects.isGammaCorrection) {
            this.composer.addPass(gammaCorrection);
        }
        if (this.effects.isEffectFilm) {
            this.composer.addPass(effectFilm);
        }
        if (this.effects.isEffectBleach) {
            this.composer.addPass(effectBleach);
        }
    }

    initFog() {
        this.scene.fog = new THREE.Fog(this.colors.white, 10, 2000);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio));
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);

        if (this.enableComposer) this.composer.render();
    }
}
