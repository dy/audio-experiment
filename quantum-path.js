/**
 * Try random signal, but form the next sample
 * as a gaussian distrib from the first sample.
 *
 * Result: It does not make a big sense, noise correlation is not that influential.
 * Thought, there is an idea to weight the distribution of each new sample as a somehow calculated expectation of formants. It is like the FT realtime, unlike the separated by blocks. Estimate how much influence the new sample had on the desired frequency domain, get proper coefficients.
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
	size: 512
});

document.body.appendChild(spectrum.canvas);
document.body.appendChild(waveform.canvas);

var prev = 0;
var f = 220;
var T = 44100/f;

Generator({
	generate: function (time, n) {
		//number of samples from the last zero
		var offset = n % T;
		var remains = T - offset;

		//ensure returning wavelength
		var sample = random(prev * (remains / T), 0.3 * remains / T);
		// if (remains / T < 0.001) console.log(prev * (remains / T), prev, sample)
		prev = sample;

		return sample;
	},
	duration: 4
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());

