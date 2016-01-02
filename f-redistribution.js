/**
 * Is it possible to redistribute frequencies perceptually to fill amplitude range?
 *
 * No. Function pas.
 * Fitting other harmonics in transitory places of main ones causes lots of side-harmonics, masking the purest second harmonic. In single period it works, but in repeated signal - no. Modulating some frequency with any other hearable frequency creates hearable set of another harmonics, though initial frequency preserves, as guessed.
 * Halving a wave - also creates hearable set of harmonics, preserving the initial wave.
 *
 * So what is the way to vary wave’s amplitude not touching the spectrum [too much]?
 * Easy - from the formula cos(a) + cos(Δ) = 2cos(a)cos(Δ); Frequencies < 20Hz are perceived as pulsations. Δ > 20Hz is almost unrecognizeable as a different tone acc to psychoacoustic bands.
 */

var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');

var spectrum = Spectrum({
	fftSize: 1024,
	smoothingTimeConstant: .8
});
var waveform = Waveform({
	size: 256
});

document.body.appendChild(spectrum.canvas);
document.body.appendChild(waveform.canvas);


function gaussian (x, mean, stdDev) {
	if (!stdDev) return mean;
	return Math.exp(- (x - mean)*(x - mean) / (2*stdDev*stdDev) );
}

var xs = [], ys = [];
for (var i = 0; i < 100; i++) { xs.push(0); ys.push(0); }

var amp =

Generator(function (time) {
	var v00 = Math.cos(Math.PI * 2 * time * 30);
	var v0 = Math.cos(Math.PI * 2 * time * 40);
	var v1 = Math.cos(Math.PI * 2 * time * 400);
	var v2 = Math.cos(Math.PI * 2 * time * 3000);

	//sum of cos's
	// var y = (v1 + v2) / 2;

	//modulated to transitions
	// var y = ((v1 > 0) ? ((1 - v1) * v2) : ((1 + v1) * v2));

	//half-wave
	// var y = (v1 > 0) ? v1 : 0;

	//spectrum-unnoticeable amp modulation
	var y = v2 * v0 * v00;

	return [y, y];
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());

