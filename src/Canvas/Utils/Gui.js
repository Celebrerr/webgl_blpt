import { Pane } from 'tweakpane';

import Canvas from '../Canvas';

export default class Gui {
    constructor() {
        this.element = new Canvas();

        this.mesh = this.element.mesh;
        this.model = this.element.model;
        this.container = this.element.container;

        this.renderer = this.element.renderer;

        this.init();
    }

    init() {
        this.debug = new Pane();

        this.debugFolder = this.debug.addFolder({
            title: 'suede',
            expanded: true,
        });
        this.tab = this.debugFolder.addTab({
            pages: [{ title: 'material' }, { title: 'lights' }],
        });

        if (this.model.settings.light) {
            // this.tab.pages[1].addInput(this.model.lightMid, 'color', {
            //     picker: 'inline',
            //     expanded: true,
            // });
        }

        if (this.container && this.container.settings.material == 'physical') {
            this.tab.pages[0].addInput(this.container.material, 'metalness', {
                min: 0.0,
                max: 1.0,
                step: 0.0001,
            });
            this.tab.pages[0].addInput(this.container.material, 'roughness', {
                min: 0.0,
                max: 1.0,
                step: 0.0001,
            });
            this.tab.pages[0].addInput(this.container.material, 'reflectivity', {
                min: 0.0,
                max: 1.0,
                step: 0.0001,
            });
            this.tab.pages[0].addInput(this.container.material, 'transmission', {
                min: 0.0,
                max: 1.0,
                step: 0.0001,
            });
            this.tab.pages[0].addInput(this.container.material, 'thickness', {
                min: 0.0,
                max: 1.0,
                step: 0.0001,
            });
        }

        if (this.model.settings.material == 'shader') {
            this.tab.pages[0].addInput(this.model.material.uniforms.uResolution, 'value', {
                label: 'resolution',
                picker: 'inline',
                expanded: true,
                x: { min: 0.3, max: 2.0, step: 0.0001, inverted: true },
                y: { min: 0.0, max: 1.0, step: 0.0001, inverted: true },
            });
            this.tab.pages[0].addInput(this.model.material.uniforms.uPink, 'value', {
                label: 'spectral',
                options: {
                    pinkBlossom: true,
                    multicolorWax: false,
                },
            });
            this.tab.pages[0].addSeparator();

            this.tab.pages[0].addInput(this.model.material.uniforms.uZoom, 'value', {
                label: 'zoom',
                min: 0.003,
                max: 1.0,
                step: 0.00001,
            });
            this.tab.pages[0].addSeparator();

            this.tab.pages[0].addInput(this.model.material.uniforms.uLight, 'value', {
                label: 'lightness',
                min: 0.0,
                max: 2.5,
                step: 0.0001,
            });

            this.tab.pages[0].addInput(this.model.material.uniforms.uColorRed, 'value', {
                label: 'red_light',
                min: 0.0,
                max: 0.9,
                step: 0.000001,
            });
            this.tab.pages[0].addInput(this.model.material.uniforms.uChaos, 'value', {
                label: 'chaos',
                min: 0.0,
                max: 10.0,
                step: 0.00001,
            });
            this.tab.pages[0].addInput(this.model.material.uniforms.uDeform, 'value', {
                label: 'deform',
                min: 1.5,
                max: 20.0,
                step: 0.00001,
            });
            this.tab.pages[0].addSeparator();

            this.tab.pages[0].addInput(this.model.material.uniforms.uSpectral, 'value', {
                label: 'spectral',
            });
        }
    }
}
