/**
 * Brickwall filter convolution experiment.
 * Proposition is simple - for each point of reality weight it (assess) so to get our
 * needed characteristic.
 *
 * Seems that brickwall filters really badly. Just some decibels.
 * Because computational convolution is too idealised operation
 * it shouldnt be like that indeed.
 *
 * Particularly this is bad comparing to simple filters as filters have natural
 * convolution property, not the emulated one, as here.
 */

var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var Spectrum = require('audio-spectrum');


var π = Math.PI;
var ππ = 2*π;


var maxF = 2000;
var minF = 1000;

//apply convolver
function brickwall (t) {
	var B = 200;

	return !t ? 0 : Math.sin(2*π*B*t) / (π*t);
}




//throttle generation each this number of seconds
var interval = 0.5;
var count = 0;

//the length of wave 20hz - ~2000 samples.
var dataLength = 44100/20;

//get initial samples
var data = [];
for (var i = 0; i < dataLength; i++) {
	data.push(Math.random() * 2 - 1);
}

//get brickwall data
var brickwallTable = [];
for (var i = 0; i < dataLength; i++) {
	brickwallTable.push(brickwall(i/44100));
}



Generator({
	samplesPerFrame: 1024,
	generate: function (t) {
		//apply interval callback
		if (t % interval < count) {

		}
		count = t % interval;

		//get new noise sample
		// var sample = Math.sin(2*π*t*1000);
		var sample = Math.random() * 2  - 1;

		//save to data buffer
		data.push(sample);
		data = data.slice(-dataLength);


		//brickwall convolution
		var result = 0, weight;

		for (var i = 0, l = data.length; i < l; i++) {
			weight = brickwallTable[i];
			result += weight * data[i];
		}

		result = !result ? 0 : result / data.length;

		return result;
	},
	duration: 4
})
.pipe(Spectrum({}).on('render', function (canvas) {console.log(canvas._canvas.frame())}))
.pipe(Speaker());