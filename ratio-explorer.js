require('enable-mobile');
let ctx = require('audio-context');
let Panel = require('settings-panel');
let Spectrum = require('gl-spectrum');



let analyser = ctx.createAnalyser();
analyser.fftSize = 1024*4;
analyser.connect(ctx.destination);

let gain = ctx.createGain();
gain.connect(analyser);

//spectrum
let frequencies = new Float32Array(1024*2);
setInterval(() => {
	analyser.getFloatFrequencyData(frequencies);
	spectrum.setFrequencyData(frequencies);
})
let spectrum = Spectrum({
	fill: 'temperature',
	maxDecibels: 0,
	type: 'fill'
});


let golden = 1.61803398875;

//TODO: try exp/11, golden/8, pi/8

let type = 'triangle';
let f = 280;
let n1 = 13;
let n2 = 3;
let n3 = 5;
let n4 = 8;
let d = 1;
let detuneF = 4;
let detuneAmp = 5;

let base = createOscillator(f);
let o1 = createOscillator(f);
let o2 = createOscillator(f);
let o3 = createOscillator(f);
let o4 = createOscillator(f);

//make unperfect unisson
o1.detune.value = 0;
// setInterval(() => {
// 	base.detune.value = Math.sin(2*Math.PI*ctx.currentTime*detuneF) * detuneAmp;
// 	o1.detune.value = Math.sin(2*Math.PI*ctx.currentTime*detuneF) * detuneAmp;
// 	o2.detune.value = Math.sin(2*Math.PI*ctx.currentTime*detuneF) * detuneAmp;
// 	o3.detune.value = Math.sin(2*Math.PI*ctx.currentTime*detuneF) * detuneAmp;
// 	o4.detune.value = Math.sin(2*Math.PI*ctx.currentTime*detuneF) * detuneAmp;
// }, 5);


// setInterval(() => {
// 	gain.gain.value = .9 + .1*Math.sin(2*Math.PI*ctx.currentTime*4);
// }, 5);


function createOscillator(f) {
	let osc = ctx.createOscillator();
	osc.type = type;
	osc.frequency.value = f;
	osc.start();
	osc.connect(gain);

	return osc;
}


function update () {
	base.type = type;
	o1.type = type;
	o2.type = type;
	o3.type = type;
	o4.type = type;
	base.frequency.value = f;
	o1.frequency.value = f * n1/d;
	o2.frequency.value = f * n2/d;
	o3.frequency.value = f * n3/d;
	o4.frequency.value = f * n4/d;
}






//settings panel
let panel = Panel([
	{id: 'timbre', type: 'switch', options: ['sine', 'square', 'sawtooth', 'triangle'], value: type, change: v => type = v },
	{id: 'frequency', type: 'range', precision: .01, min: 20, log: true, value: f, max: 15000, change: v => {
		f = v;
	}},
	{id: 'denominator', type: 'range', step: 1, min: 1, max: 17, value: d, change: v => {
		d = v;
	}},
	{type: 'raw', content: 'Ratios'},
	{id: 'n1', label: 'Osc 1', type: 'range', step: .00001, min: 1, max: 17, value: n1, change: v => {
		n1 = v;
	}},
	{id: 'n2', label: 'Osc 2', type: 'range', step: .00001, min: 1, max: 17, value: n2, change: v => {
		n2 = v;
	}},
	{id: 'n3', label: 'Osc 3', type: 'range', step: .00001, min: 1, max: 17, value: n3, change: v => {
		n3 = v;
	}},
	{id: 'n4', label: 'Osc 4', type: 'range', step: .00001, min: 1, max: 17, value: n4, change: v => {
		n4 = v;
	}},
	// {type: 'raw', content: 'Detune'},
	// {id: 'detuneAmp', label: 'amplitude', type: 'range', step: 1, min: -500, max: 500, value: detuneAmp, change: v => {
	// 	detuneAmp = v;
	// }},
	// {id: 'detuneF', label: 'frequency', type: 'range', log: true, min: 0.01, max: 20, value: detuneF, change: v => {
	// 	detuneF = v;
	// }}
], {
title: '<a href="https://github.com/dy/sound-experiment">Ratio explorer</a>',
css: `
	:host {
		background: none;
		color: white;
	}
`
}).on('change', update);




