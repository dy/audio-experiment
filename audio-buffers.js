/**
 * It appeared that in WebAudioAPI buffers are not transformed like in streams, but modified in place.
 * In that, test - hom much is it intensely to merge set of buffers of various lengths into output. What is the maximum number of troublesome mixing?
 *
 * Results:
 * - 1000 is the maximum available number of mixed buffers.
 * - Oscillators are slower than buffers (only 300-400). But they sound more naturally (whyy?)
 * - Oscillators are impossible to merge before the audioContextDestination
 * - Noise is impossible to reproduce on such buffer matrix. Each buffer represents specific set of frequencies, multiples of Fs/2.
 * - Good thing about noise - it is possible to lay it once afterwards instead or multiple formants mixed.
 * ! what if represent formant not as the sine separated from noise, but as the sum of sine and filtered noise, expressed in quality param? That would guarantee the stability of the sine’s amplitude. Thats funny because we have not the sine machine (damper) drived by the noise, but the noise machine, drived by the sine.
 */

var AudioBuffer = require('audio-buffer');
var ctx = require('audio-context');
// var Spectrogram = require('audio-spectrogram');
var util = require('audio-buffer-utils');


//setup values
var nodes = [];
var size = 50, maxF = 20000, minF = 20;


//start the game
createBuffers(nodes);
// createOscillators(nodes);
start(nodes);



//create set of audioSourceNodes
function createBuffers (nodes) {
	for (var n = 0; n < size; n++) {
		var node = ctx.createBufferSource();
		node.loop = true;

		//get frequency
		var f = ((n/size) * maxF) + minF;
		var buffer = createSinBuffer(f);
		// util.fill(buffer, function (v) { return Math.random() * 2 - 1});

		node.buffer = buffer;
		nodes.push(node);
		node.connect(ctx.destination);
	}

	// console.log(nodes[0].buffer)
}

//create mega-oscillator matrix
function createOscillators (nodes) {
	var real = new Float32Array(2);
	var imag = new Float32Array(2);
	real[0] = 0;
	imag[0] = 0;
	real[1] = 1;
	imag[1] = 1;

	var wave = ctx.createPeriodicWave(real, imag);


	for (var n = 0; n < size; n++) {
		var node = ctx.createOscillator();
		node.type = 'sine';
		// node.setPeriodicWave(wave);

		//get frequency
		var f = ((n/size) * maxF) + minF;
		node.frequency.value = f; // value in hertz

		nodes.push(node);
		node.connect(ctx.destination);
	}
}


//connect nodes to spectrogram
function connectTo (nodes, node) {
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].connect(node);
	}
}



function gaussian (x, mean, stdDev) {
	if (!stdDev) return mean;
	return Math.exp(- (x - mean)*(x - mean) / (2*stdDev*stdDev) );
}



//start nodes
function start (nodes) {
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].start();
	}
}


//create buffer of a 2Pi sine
function createSinBuffer (f) {
	var T = 1/f;
	var rate = ctx.sampleRate;
	var length = T * rate;

	//randomize phase
	var phase = 0//length * Math.random();

	//correct f to match end value
	f = 1 / (length / rate);

	// length *= 16;

	var buffer = new AudioBuffer(1, length, rate);

	var data = buffer.getChannelData(0);
	for (var i = 0; i < length; i++) {
		data[i] = Math.cos(f * Math.PI * 2 * i/rate + phase);
	}

	return buffer;
}

