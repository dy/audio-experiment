/**
 * Tasks.
 * 0. Play with autocorrelation coefficients to understand it’s sense (filter base).
 * 1. Ones say that f domain of the noise = autocorrelation of that noise. Check that.
 * 2. Quantum mechanics say just generate probability distribution for a new moment. Understand how.
 * Note that gaussian in spectrum === some special kind of pulse in time.
 * ∞. Question of the all research is to find a way to generate probablistic function for a moment of stochastic process, which in frequential domain will create a gaussian distribution. Then, bind this understanding to the map of a signal.
 *
 * Results.
 * 0. self-correlationary coefficients reflect the relationship of a signal with itself via adding/subtracting the part of itself from the input. By the fraction of sample distance the needed autocorrelation frequency is obtained - quite easily, poles or zeros.
 * 0.1 Z-transform appears to be able to explain relationship, but IDK how does it work?
 * 0.2 how to reproduce any frequency, not only the exact fraction?
 * 0.3 seems that spiral is a way better self-correlatory function, than discrete autocorrelation. Wave repeats itself in some "constructive" way.
 * Probably I should find an explanation of exact shape of wave packets. Shrodiger’s equation is an external shape, a test for such functions to accord to reality, but the functions by itself are self-causing. As if some force starts to empower self’s disbalance, and after a while starts magneting it back.
 * 1. Gaussian spectral plot seems to be a logarithmic spiral in circular plot.
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

Generator(function (time) {
	var x = Math.random() * 2 - 1;

	//save x
	xs.unshift(x);
	xs.pop();

	// var a = [0, 0, 0];
	// var b = [1, 0, 0];
	// var y = (b[0]*xs[0] + b[1]*xs[1] + b[2]*xs[2]) - (a[0]*ys[0] + a[1]*ys[1] + a[2]*ys[2]);

	// var y = x + 0.4 * ys[1] - 0.8 * ys[2];
	// var y = 0.45 * x + 0.18 * ys[1] - 0.76 * ys[2];
	var y = 0.5*x + 0.5 * ys[3] * xs[3];

	//save y
	ys.unshift(y);
	ys.pop();

	return [y, y];
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());

