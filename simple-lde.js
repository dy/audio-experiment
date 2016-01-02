/**
 * Just testing some DEs in sound environment.
 * Like y' = -x/y
 */

var Speaker = require('audio-speaker');
var Generator = require('audio-generator');
var Waveform = require('audio-waveform');
var Spectrum = require('audio-spectrum');



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


//position of our system
var lastTime = 0;

var spectrum = Spectrum({
	fftSize: 256,
	smoothingTimeConstant: 0.9
});

if (typeof document !== 'undefined') {
	document.documentElement.appendChild(spectrum.canvas);
}

var y = [0, 0];
var x = 0, dx = 0.0001;

var generator = new Generator({
	generate: function (time) {
		//calc time
		// var dt = time - lastTime;
		// lastTime = time;

		xxx
		//DOESNTWORK IMSTUPID

		//dy/dx = -x/y
		x += dx;
		y[1] = - x / y[0] || 999999;
		y[0] += y[1] * dx;
		(time % 0.1 < 0.00003) && console.log(x)

		return x;
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
	// process.stdout.write(canvas.toString());
});






generator.pipe(speaker);