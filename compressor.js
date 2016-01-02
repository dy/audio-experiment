/**
 * Just interesting to see how the compressor’s spectrum looks like.
 * Well, it creates something like smoothly distributed frequency,
 * something in between rect and sine. That is why with lots of harmonics.
 */

var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var random = require('distributions-normal-random/lib/number')

var spectrum = Spectrum({
	fftSize: 512,
	smoothingTimeConstant: .9
});
var waveform = Waveform({
	size: 256
});

document.body.appendChild(spectrum.canvas);
document.body.appendChild(waveform.canvas);


var f = 1000;

Generator({
	generate: function (time, n) {
		// var sample = Math.sin(Math.PI * 2 * time * f);

		var power = 1/100;

		if (sample > 0) sample = Math.pow(sample, power);
		else if (sample < 0)  sample = -Math.pow(-sample, power);

		return sample;
	},
	duration: 10
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());

