/**
 * LDE fun, generalized oscillators
 */

var Speaker = require('audio-speaker');
var Generator = require('audio-generator');
var Waveform = require('audio-waveform');
var Spectrum = require('audio-spectrum');
var Gaussian = require('gaussian');



var speaker = new Speaker();


function sin (t, f) {
	return Math.sin(Math.PI * 2 * f * t);
}
function cos (t, f) {
	return Math.cos(Math.PI * 2 * f * t);
}
function impulse (t) {
	return t === 0 ? 1 : 0;
}
function noise (t) {
	return Math.random() * 2 - 1;
}


var gaussian = Gaussian(0,.01);


//position of our system
var lastTime = 0;

//spring params to get needed system frequency
var f = 5000;
var k = Math.PI * Math.PI * 4 * f * f;
var mass = 1;
var c = 2;

//energy === accleration for a movement === disbalance
var disbalance = 0;
var velocity = 0;
var state = 1;

//diff eq y's
var y = [state, velocity, disbalance, 0, 0];

//diff eq coefficients
var a = [k, c, mass, -1];


var spectrum = Spectrum({
	fftSize: 256,
	smoothingTimeConstant: 0.9
});


if (typeof document !== 'undefined') {
	document.documentElement.appendChild(spectrum.canvas);
}


var generator = new Generator({
	generate: function (time) {
		//calc time
		var dt = time - lastTime;
		lastTime = time;

		// var input = Math.random() * 2 - 1;
		// var input2 = Math.random() * 2 - 1;
		var input = gaussian.ppf(Math.random());
		var input2 = gaussian.ppf(Math.random());

		// y[4] = - (a[3] * y[3] + a[2] * y[2] + a[1] * y[1] + a[0] * y[0]);
		// y[3] += y[4] * dt;
		// y[2] += y[3] * dt;

		//get new energy from (the last state minus dissipated)
		y[2] = -(a[1] * y[1] + a[0] * y[0]);
		y[1] += y[2] * dt;
		y[0] += y[1] * dt;

		//this param regulates input amount
		y[0] += 0.003*input;

		//this coef is single-step dim/boost, a[0] factually
		y[0] *= (0.99 + 0.01*input2);

		//randomized frequency - need some algorithmic way to avoid close-0
		a[0] *= (1 + 0.001*input);
		a[0] += (input2 + 1) * 10;

		//randomized boost
		// a[1] *= (1 + input2*0.4);

		return y[0];
	},
	// duration: 10,
	samplesPerFrame: 256/2
})
.on('end', function () {
})
// .pipe(Waveform({
// 	offset: 0,
// 	size: 256*32
// }))
.pipe(spectrum)
.on('render', function (canvas) {
	process.stdout.write(canvas.toString());
});






generator.pipe(speaker);