/**
 * Plays with oscillator system.
 *
 * Setting noise as a driver input is good, but we need to limit resonance amount.
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


//energy === accleration for a movement === disbalance
var disbalance = 0;

//current direction of a movement
var velocity = 0;

//initial position is edge (delta-impulse)
var position = 0;

var lastTime = 0;

//diff eq y's
var y = [position, velocity, disbalance];

//spring params to get needed system frequency
var f = 5000;
var k = Math.PI * Math.PI * 4 * f * f;
var m = 1;
var c = 1;

//diff eq coefficients
var a = [k, c, m];


var generator = new Generator({
	generate: function (time) {
		//calc time
		var dt = time - lastTime;
		lastTime = time;

		// var input = Math.random() * 2 - 1;
		// var input2 = Math.random() * 2 - 1;
		var input = gaussian.ppf(Math.random());


		//get new energy from (the last state minus dissipated)
		y[2] = -(a[1] * y[1] + a[0] * y[0]);

		y[1] += y[2] * dt;

		y[0] += y[1] * dt;

		//add some energy from noise
		y[0] += 0.001*input;

		//this coef is single-step dim/boost, a[0] factually
		// y[0] *= 0.99;
		// y[0] *= (0.99 + 0.01*input2);

		//

		return y[0];
	},
	// duration: 10
})
.on('end', function () {
})
.pipe(Spectrum({
	fftSize: 256,
	smoothingTimeConstant: 0.9
}))
.on('render', function (canvas) {
	process.stdout.write(canvas.toString());
});


generator.pipe(speaker);