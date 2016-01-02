/**
 * How normal-distributed value differs from uniform?
 * In no way.
 */

var Speaker = require('audio-speaker');
var Spectrum = require('audio-spectrum');
var Generator = require('audio-generator');
var Gaussian = require('gaussian');

var gaussian = Gaussian(0,0.1);

Generator(function (t) {
	// return Math.random() * 2 - 1;
	return gaussian.ppf(Math.random());
})
.pipe(Spectrum({
	fftSize: 128
}))
.on('render', function (canvas) {
	console.log(canvas.toString())
})
.pipe(Speaker());