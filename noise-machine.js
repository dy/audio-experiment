/**
 * Formant is a noise machine, drived by the sine. What is that?
 * 1. What if to try micro-stretching/shrinking the main sine’s flow?
 * - That theory seems to accord with qm - each moment there is a probability of finding one or another frequency;
 * - That seems to be logical, as frequencies, which are different scales of time
 *
 * IT WORKS!!!!!
 * I need only to:
 * - map controlling values to 0..1 range
 * - map frequency to speed param
 * - create huuuge infrastructure of engaging them.
 *     That seems to be ok to update formats not really often, in that buffer matrix.
 */

var AudioBuffer = require('audio-buffer');
var ctx = require('audio-context');
// var Spectrogram = require('audio-spectrogram');
var util = require('audio-buffer-utils');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var random = require('distributions-normal-random/lib/number');
var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');


var spectrum = Spectrum({
	fftSize: 512,
	smoothingTimeConstant: .9
});
var waveform = Waveform({
	size: 128
});

document.body.appendChild(spectrum.canvas);
document.body.appendChild(waveform.canvas);

//try to walk on the sine with different speed
var f = 440;
var phase = 0;
var lastTime = 0;
var pi2 = Math.PI * 2;

var speed = 9000; //rad/step
var q = 10000;

Generator(function (time) {
	var dt = time - lastTime;
	lastTime = time;
	dt += random(0, 1/q);
	phase += speed * dt;
	phase = (phase) % pi2;
	var value = Math.cos(phase);

	return value;
})
// .pipe(spectrum)
// .pipe(waveform)
.pipe(Speaker());



//add a bit of interface
if (typeof document !== 'undefined') {
	var speedEl = document.createElement('input');
	speedEl.type = 'range';
	speedEl.min = 100;
	speedEl.max = 20000;
	speedEl.step = 5;
	speedEl.value = speed;
	speedEl.addEventListener('input', function (e) {
		speed = parseInt(speedEl.value);
	});
	document.body.appendChild(speedEl);

	var qEl = document.createElement('input');
	qEl.type = 'range';
	qEl.min = 1;
	qEl.max = 1000000;
	qEl.step = 100;
	qEl.value = q;
	qEl.addEventListener('input', function (e) {
		q = parseInt(qEl.value);
	});
	document.body.appendChild(qEl);
}