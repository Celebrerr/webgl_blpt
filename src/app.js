import Canvas from './Canvas/Canvas';

import './style.css';

const canvas = new Canvas(document.querySelector('.webgl'));
const recordCanvas = document.querySelector('.webgl');

const activeCapture = false;

const captureFrame = () => {
    const capturer = new CCapture({
        format: 'webm',
        //? only for gif
        // workersPath: 'js/',
        framerate: 30,
        verbose: false,
        name: 'capture_',
        display: true,
        quality: 100,
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'p') {
            console.log('start capturing, freeeetm!');
            capturer.start();
        }
        if (e.key === 's') {
            console.log('stop capturing, broooowawa!');
            capturer.stop();
            capturer.save();
        }
    });

    function render() {
        requestAnimationFrame(render);
        capturer.capture(recordCanvas);
    }
    render();
};

if (activeCapture) captureFrame();
