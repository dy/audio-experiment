/**
 * Test how the sine expressed in terms of randomity is heard. Suppose just like the added noise, right?
 * Right.
 *
 * But what if to vary lde params by frequency taken as gaussian?
 * It is interesting, but requires stabilization of accleration, as it raises infinite jumps, which are impossible in reality.
 *
 * Maybe frequencies should be picked evenly or something like correlated (avoid jumps),
 * as natural systems does not expose such rigid jumps between resonating frequencies?
 * Or maybe detect clipping or something, and decrease accleration?
 * At first we gotta find out the reason of overaccleration.
 * Also gotta remove instability (jumping magnitude)
 * Also gotta remove extra-harmonics (wtf, why are them? overamplifying?)
 * - they seem to be an pain in the ass of clipping / the lde itself
 *
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


var frequency = 4400;
var T = 44100 / frequency;

var lastTime = 0;

//diff eq y's
var y = [1, 0, 0];

//diff eq coefficients
var a = [0, 0, 0];

var prevF = frequency;


function gaussian (x, mean, stdDev) {
	if (!stdDev) return mean;
	return Math.exp(- (x - mean)*(x - mean) / (2*stdDev*stdDev) );
}


Generator({
	generate: function (time, n) {
		var dt = time - lastTime;
		lastTime = time;

		var offset = n % T;

		//get f
		var stdDev = 0;
		var f = random(frequency, stdDev);
		// f = prevF * 0.9 + f * 0.1;
		prevF = f;

		//relocate system params by the new f taken
		a[0] = Math.PI * Math.PI * f * f * 4;

		//get new energy from (the last state minus dissipated)
		y[2] = -(a[1] * y[1] + a[0] * y[0]);


		//we need to stabilize maximum accleration. how?

		//inverting sampling? No - useless
		// if ((frequency > f && frequency > prevF) || (frequency < f && frequency < prevF) ) {
		// 	f = -f;
		// }
		// prevF = f;

		//avoiding infinities? No - destabilizes still
		// if (y[2] === Infinity) {
		// 	console.log(1)
		// 	y[2] = Number.MAX_VALUE
		// }
		// if (y[2] === -Infinity) {
		// 	y[2] = Number.MIN_VALUE
		// }

		y[1] += y[2] * dt;

		y[0] += y[1] * dt;

		if (!y[0]) {
			console.log(f, a[0], y[2]);
			throw Error(':(')
		}

		return y[0];

		//sin added with noise
		// return random(Math.sin(Math.PI * 2 * time * f), 0.1);
	},
	duration: 10
})
.pipe(spectrum)
.pipe(waveform)
.on('render', function (canvas) {
	// console.log(canvas.toString());
})
.pipe(Speaker());

