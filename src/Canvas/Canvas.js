import * as THREE from 'three';
import normalizeWheel from 'normalize-wheel';

import Sizes from './Utils/Sizes';
import Time from './Utils/Time';

import Container from './Components/Container';
import Model from './Components/Model';
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
        this.model = new Model();
        this.mesh = new Mesh();

        this.camera = new Camera();
        this.renderer = new Renderer();

        this.gui = new Gui();

        this.sizes.on('resize', () => {
            this.resize();
        });

        this.time.on('tick', () => {
            this.update();
        });

        this.scroll = {
            ease: 0.05,
            current: 0,
            target: 1,
            last: 0,
        };

        this.addEventListener();
    }

    onWheel(e) {
        const normalized = normalizeWheel(e);
        const speed = normalized.pixelY;

        this.scroll.target += speed * 0.005;
    }

    onTouchDown(e) {
        this.isPressed = true;

        this.scroll.position = this.scroll.current;
        this.start = e.touches ? e.touches[0].clientY : e.clientY;
    }

    onTouchMove(e) {
        if (!this.isPressed) return;

        const y = e.touches ? e.touches[0].clientY : e.clientY;
        const distance = (this.start - y) * 0.01;

        this.scroll.target = this.scroll.position + distance;
    }

    onTouchUp() {
        this.isPressed = false;
    }

    addEventListener() {
        window.addEventListener('mousewheel', this.onWheel.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this));

        window.addEventListener('touchstart', this.onTouchDown.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
        window.addEventListener('touchend', this.onTouchUp.bind(this));
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
    }

    update() {
        //? Get update to...
        if (this.container) this.container.update();
        if (this.model) this.model.update(this.scroll);
        if (this.mesh) this.mesh.update();

        this.camera.update();
        this.renderer.update();
    }
}
