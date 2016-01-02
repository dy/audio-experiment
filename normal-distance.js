/**
 * Q: How does the normal-distributed distance between the impulses
 * is reflected in spectrum domain?
 *
 * A: It adds noise to it. To put simply, to add noise to spectral domain -
 * you need vary signal in time, smoothly.
 *
 * Interestingly enough gaussian in spectral domain === gaussian in time domain.
 */

var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var rand = require('distributions-normal-random/lib/number')

var spectrum = Spectrum({
	fftSize: 1024,
	smoothingTimeConstant: .8
});
var waveform = Waveform({
	size: 256
});

document.body.appendChild(spectrum.canvas);
document.body.appendChild(waveform.canvas);

var f = 100;
var offset = rand(f/44100,0);

Generator(function (t) {
	if (t > offset) {
		offset += rand(f/44100,f/44100*0.005)
		return 1;
	}

	return 0;
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	console.log(canvas.toString());
})
.pipe(Speaker());

