/**
 * How does it sound approximating spectrum with formants
 */

require('enable-mobile')
const fs = require('fs')
const Audio = require('../audio')
const createPlot = require('gl-component')
const createWaveform = require('gl-waveform')


//TODO: create spectrum with gl-spectrum
//TODO: create waveform with gl-waveform
//TODO: paint spectrum for current waveform selection (mouse interaction)
//TODO: make spectrum hearable
//TODO: add manual gaussian-fit spectrum approximation
//TODO: make gaussian hearable (same way as hearable spectrum)
//TODO: render gaussian spectrum over original spectrum


//create spectrum
let plot = createPlot({
	autostart: false,
	draw: (gl, vp, data) => {
		if (!data) return;
		let {points, color} = data;

		plot.setAttribute('position', points);
		plot.setUniform('color', color);
		gl.drawArrays(gl.LINE_STRIP, 0, points.length/2);
	},
	vert: `
		attribute vec2 position;
		void main () {
			gl_Position = vec4(position.x*2. - 1., position.y*2. - 1., 0, 1);
		}
	`,
	frag: `
		precision mediump float;

		uniform vec4 color;

		void main(void) {
			gl_FragColor = color;
		}
	`
})

function drawSpectrum (data, color) {
	if (!color) color = [0,0,0,1];
	let points = Array(data.length*2);
	let maxF = 44100, minF = 20;
	for (let i = 0; i < data.length; i++) {
		let f = (maxF - minF) * i/data.length;
		points[i*2] = Math.log(f/minF) / Math.log(maxF/minF);
		points[i*2+1] = data[i];
	}
	plot.render({points, color});
}



//load audio
let a = Audio('./chopin.mp3').on('load', (audio) => {
	handle(audio)
})


function handle(audio) {
	//get spectrum at offset
	let spectrum = audio.spectrum(1);

	let max = spectrum.reduce((prev, curr) => Math.max(prev, curr), 0);
	spectrum = spectrum.map(v => v/max);

	// console.log(spectrum)
	drawSpectrum(spectrum)
}

// setTimeout(() => {
// 	a.stop()
// 	b.stop()
// }, 3000)
