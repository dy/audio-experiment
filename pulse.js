var Generator = require('audio-generator');
var Speaker = require('audio-speaker');

Generator(function (time) {

}).pipe(Speaker());


function Pulse (item) {
	if (!(this instanceof Pulse)) return new Pulse(arg);

	this.pulses = [];
	this.formants = [];

	//frequencies relation
	this.frequencies = [];

	this.magnitudes = [];

	this.qualities = [];

	this.spatial = [];

	//chances of following pulses
	this.next = [];
}
Pulse.prototype.add = function (item) {
	this.items.push(item);
};

function Formant () {
	this.time = 0;

	var position = 0, velocity = 0, disbalance = 0;

	this.y = [position, velocity, disbalance];

	//spring params to get needed system frequency
	var f = 5000;
	var k = Math.PI * Math.PI * 4 * f * f;
	var m = 1;
	var c = 1;

	//diff eq coefficients
	this.coef = [k, c, m];
};


/**
 * Generate new formant data item
 */
Formant.prototype.get = function (time) {
	var dt = time - this.time;
	this.time = time;

	var input = gaussian.ppf(Math.random());

	//get new energy from (the last state minus dissipated)
	y[2] = -(this.coef[1] * y[1] + this.coef[0] * y[0]);
	y[1] += y[2] * dt;
	y[0] += y[1] * dt;

	//add some energy from noise
	y[0] += 0.001*input;

	return y[0];
};