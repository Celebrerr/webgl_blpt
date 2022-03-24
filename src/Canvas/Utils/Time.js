import EventEmitter from './EventEmitter';

export default class Time extends EventEmitter {
    constructor() {
        super();

        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        //? Default screen run at 16 FPS so it' better have a delta time (time between each frame in ms)
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }
}
