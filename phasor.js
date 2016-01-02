/**
 * Simple phasor
 *
 * General disadvantage is still acute transition between f's. As if phasor does not have inertia.
 *
 * That the same problem  is for system of phasors. Seems that we have to find a way to smoothly rebalance the energy between set of phasors.
 *
 * Another problem of phasors - they are computationally expensive. Formants should approximate the resulting phasors [закономерное явление] by approximating the spectrogram of filtered noise at needed points. E. g. 5 formants = 40 phasors.
 * - people recognize spectrum about a note, so that is the desired quality.
 */

var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var Spectrum = require('audio-spectrum');


var π = Math.PI;
var ππ = 2*π;

//simple oscillator
function Phasor (f, A, θ) {
	this.θ = θ != null ? θ : 0;
	this.A = A != null ? A : 1;
	this.f = f != null ? f : 0;
}

Phasor.prototype.re = function (t) {
	t = t % ππ;
	var ω = this.f * ππ;

	// return this.A * Math.cos(ω*t + this.θ);
	return this.A * Math.cos(ω*t + this.θ)
	 + this.A * 0.3 * Math.cos(2*ω*t + this.θ)
	 + this.A * 0.2 * Math.cos(3*ω*t + this.θ)
	 + this.A * 0.2 * Math.cos(4*ω*t + this.θ)
	 + this.A * 0.2 * Math.cos(5*ω*t + this.θ)
	 + this.A * 0.2 * Math.cos(6*ω*t + this.θ)
	 + this.A * 0.1 * Math.cos(7*ω*t + this.θ)
	 + this.A * 0.1 * Math.cos(8*ω*t + this.θ)
	 + this.A * 0.1 * Math.cos(9*ω*t + this.θ)
	 + this.A * 0.1 * Math.cos(10*ω*t + this.θ)
	 + this.A * 0.1 * Math.cos(11*ω*t + this.θ)
}


var maxF = 2000;
var minF = 1000;


//our phasors set
var phasors = [];
var phasorsNumber = 30;
for (var i = 0; i < phasorsNumber; i++) {
	phasors.push(new Phasor());
}

//generate phasors frequencies
function shuffle () {
	for (var i = 0; i < phasorsNumber; i++) {
		phasors[i].f = Math.random() * (maxF - minF) + minF;
		phasors[i].A = Math.random();
	}
}

shuffle();


//throttle generation each this number of seconds
var interval = 0.05;
var count = 0;

Generator({
	samplesPerFrame: 1024,
	generate: function (time) {
		//apply interval callback
		if (time % interval < count) {
			shuffle();
		}
		count = time % interval;

		//sum phasors
		var output = 0;
		output = phasors.reduce(function (a, b) {
			return a + b.re(time);
		}, 0) / phasorsNumber;

		return output;
	}
})
.pipe(Spectrum({}).on('render', function (canvas) {console.log(canvas.toString())}))
.pipe(Speaker());