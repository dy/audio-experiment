/**
 * How many samples per second in frequency domain there should be to prevent user recognize steps?
 * - Obviously 20k for 20khz and 20 for 20hz, or 200 at average case for swipes.
 *
 * - But stupid glueing of sines creates unpleasant noise of too harsh switch of frequency, we need something like damping system, where energy affects accleration, not the instant change.
 *
 * How many frequency bins there should be in frequency domain to reproduce sound?
 * - In case of formants the answer is easy. The question is how to reproduce formants.
 * - In the static case (evenly sampled time/frequency) - that is a clever conjecture about the degrees of freedom, constituting the sound (harmonics).
 *
 * Is there a diff between oscillator system, changing it’s frequency and a sampled set of frequency values for oscillators matrix? How bad is the glueing of the last?
 * That would be fun to play with streaming audio, having fft matrices at fixed points eg 1 time a second, consisting of a set of generators.
 */


var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var Spectrum = require('audio-spectrum');
var Waveform = require('audio-waveform');
var loop = require('mumath/loop');


function sampleNumberForFrequency (hz) {
	return 44100 / hz;
}

function frequencyPeriod (hz) {
	return 1 / hz;
}


var lastFrameNumber = 0;
var frequency = 200;
var angle = 0;
var lastTime = 0;
var lastValue = 0;
var phase = 0;

var ππ = Math.PI * 2;
var π = Math.PI;


var framesPerSecond = 50;
var frequencyChange = 5000;


Generator({
	generate: function (time) {

		var frameNumber = Math.floor(time / frequencyPeriod(framesPerSecond));

		if (frameNumber > lastFrameNumber) {
			lastFrameNumber = frameNumber;
			frequency = frequencyChange * frameNumber / framesPerSecond;
			var oldAngle = angle;
			var newAngle = loop(ππ * time * frequency + phase, -π, +π);
			var angleDiff = loop(newAngle - oldAngle, ππ);
			phase -= angleDiff;
		}

		angle = loop(ππ * time * frequency + phase, -π, +π);
		var value = Math.sin(angle);

		lastValue = value;
		lastTime = time;

		return value;
	},

	duration: 1,

	samplesPerFrame: Math.round(sampleNumberForFrequency(framesPerSecond))
})
.on('end', function () {
})
// .pipe(Waveform({size: 44100 / 8}).on('render', function (canvas) {process.stdout.write(canvas._canvas.frame())}))
.pipe(Spectrum({fftSize: 128}).on('render', function (canvas) {process.stdout.write(canvas._canvas.frame())}))
.pipe(Speaker());