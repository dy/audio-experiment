/**
 * Is it real that gaussian shape in time domain === gaussian in spectral domain?
 *
 * Not sure, it is only analytically provable.
 * But in practice, normally distanced gaussians are the same noise pattern.
 * Probably we need some autocorrelation in generating distance?
 *
 * BTW sounds like a brass
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


function gaussian (x, mean, stdDev) {
	if (!stdDev) return mean;
	return Math.exp(- (x - mean)*(x - mean) / (2*stdDev*stdDev) );
}

var f = 100;
var T = rand(f/44100,0);
var nextPeriodTime = 0;

Generator(function (absTime) {
	if (absTime > nextPeriodTime) {
		nextPeriodTime += rand(f/44100,0.00005);
	}

	//rel time
	var t = T - (nextPeriodTime - absTime);

	//render gaussian
	return gaussian(t, T/2, 0.0001);

	//triangle
	// return t/T;
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	console.log(canvas.toString());
})
.pipe(Speaker());

