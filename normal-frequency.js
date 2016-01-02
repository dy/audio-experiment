/**
 * Approximate normal distribution in spectrum domain,
 * how does it sounds?
 *
 * 1. ↑ quality (↓ variance) leads to obtaining single sinusoid.
 * 	In reality seems that f domain is never an integer
 * 	and anything not an integer converts in time domain to pulse
 * 	not to pure infinite sine.
 *
 * 2. ↓ quality really approximates to a noise, calculatory difficult here.
 *  At least amount of sines calculated might be subbanded by perception bands.
 *
 * Seems that formant indeed is just a that short pulse, which is way better close to reality than the idealized FT or oppositely idealized Poisson distribution.
 *
 * At least you can estimate noise.
 *
 * It is really funny and allows huge variety of sounds.
 * Especially interesting is playing with multiple overtones.
 *
 * Also: see audio-buffers.js experiment. Same shit, WAA engaged!
 */

var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var random = require('distributions-normal-random/lib/number')

var spectrum = Spectrum({
	fftSize: 1024,
	smoothingTimeConstant: .9
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


var meanF = 5000;
var stdDev = 1000;
var fSamplesNumber = 50;
var cosTable = [];

Generator(function (time, n) {
	var result = 0;

	var phase = Math.PI * 2 * time;

	//summ way
	// for (var i = 0; i < fSamplesNumber; i++) {
	// 	var f = ((i / fSamplesNumber) * (stdDev * 3 *2) - (stdDev * 3)) + meanF;
	// 	var w = gaussian(f, meanF, stdDev);
	// 	result += w * Math.sin(phase * (f));
	// }
	// result /= fSamplesNumber;

	//multiply way, from cos(a + Δ) + cos(a - Δ) = 2cos(a)cos(Δ)
	var source = Math.cos(phase * meanF);
	var result = source;
	for (var i = 1; i < fSamplesNumber; i++) {
		var d = i * 2 / fSamplesNumber * stdDev * 3;
		var w = gaussian(meanF + d, meanF, stdDev);
		result += 2 * w * source * Math.cos(phase * d + i % 11);
	}
	result /= fSamplesNumber*2;

	return result;
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());



//add a bit of interface
if (typeof document !== 'undefined') {
	var samplesNumberEl = document.createElement('input');
	samplesNumberEl.type = 'range';
	samplesNumberEl.min = 1;
	samplesNumberEl.max = 200;
	samplesNumberEl.step = 1;
	samplesNumberEl.value = fSamplesNumber;
	samplesNumberEl.addEventListener('input', function (e) {
		fSamplesNumber = parseInt(samplesNumberEl.value);
	});
	document.body.appendChild(samplesNumberEl);

	var freqEl = document.createElement('input');
	freqEl.type = 'range';
	freqEl.min = 1;
	freqEl.max = 20000;
	freqEl.step = 1;
	freqEl.value = meanF;
	freqEl.addEventListener('input', function (e) {
		meanF = parseInt(freqEl.value);
	});
	document.body.appendChild(freqEl);

	var devEl = document.createElement('input');
	devEl.type = 'range';
	devEl.min = 1;
	devEl.max = 20000;
	devEl.step = 1;
	devEl.value = stdDev;
	devEl.addEventListener('input', function (e) {
		stdDev = parseInt(devEl.value);
	});
	document.body.appendChild(devEl);
}