/**
 * Goal: test how does it sound convolving white noise with sample waveform function
 *
 * Result: indeed convolving white noise with sound waveform creates ambient atmosphere, or elongates sound in other words. In frequency terms it adds all known frequencies of the sound together, so that swipe becomes noise etc. The thing making it sound natural rather than precise sum of frequencies is uneven input noise distribution, so that we mask noise rather than flat white (though flat white is the same noise down below, but that's another story).
 *
 * In frequency domain convolution is multiplication of source signal with convolution profile, i. e. simple masking operation, as follows from convolution theorem.
 *
 * Looking from the point of signal analysis and synthesis we don't get sound manipulation variables like ADSR, nor do we learn how to reproduce the sound, we don't understand it, just copy almost precisely. I. e. we cannot estimate this bassoon and exactly the same another one as the same sound.
 * But that is a step further away from precise waveform reproduction.
 * Ideally we would learn inner relations of a sound and learn how to reproduce it, some sort of context/pattern analysis.
 *
 */

let audioContext = new AudioContext();

let load = require('audio-loader');


// load one file
load('./bassoon.wav').then(function (buffer) {
	let bufferSize = 4096;
	let whiteNoise = audioContext.createScriptProcessor(bufferSize, 1, 1);
	let count = 0;
	whiteNoise.onaudioprocess = function(e) {
		let output = e.outputBuffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) {
			//impulse response
			output[i] = (count + i) ? 0 : 1;

			//noise response
			output[i] = Math.random() * 2 - 1;
		}
		count += bufferSize;
	}

	let convolver = audioContext.createConvolver();
	convolver.buffer = buffer;


	whiteNoise.connect(convolver);
	convolver.connect(audioContext.destination);



	setTimeout(() => {
		whiteNoise.disconnect();
	}, 5000)
})


