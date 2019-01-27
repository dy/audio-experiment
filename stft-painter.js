import Waveform from 'gl-waveform'
import {on, off, emit} from 'emmy'
import Writer from 'web-audio-write'
import OO from 'ooura'
import raf from 'raf'


let ctx = new AudioContext()
let analyser = ctx.createAnalyser();
analyser.fftSize = 512;
analyser.smoothingTimeConstant = .95;
analyser.connect(ctx.destination);


let paintedSpectrum = Waveform({
	color: '#001144',
	width: 2
})
let realSpectrum = Waveform({
	canvas: paintedSpectrum.canvas,
	color: '#006699',
	opacity: .2
})

raf(function draw () {
	let arr = new Uint8Array(analyser.frequencyBinCount)
	analyser.getByteFrequencyData(arr)

	// let arr = new Float32Array(analyser.frequencyBinCount)
	// analyser.getFloatFrequencyData(arr)

	if (arr[0] !== -Infinity) {
		realSpectrum.update(arr)
		realSpectrum.render()
		paintedSpectrum.render()
	}

	raf(draw)
})


const FFT_SIZE = 512
let mags = new Float64Array(FFT_SIZE)
mags[30] = 1
paintedSpectrum.set(mags).render()

let write = Writer(analyser, {samplesPerFrame: FFT_SIZE / 2})

// Set up the FFT
let oo = new OO(mags.length * 2, {"type":"real", "radix":4});
let output = oo.scalarArrayFactory();
let re = oo.vectorArrayFactory();
let im = oo.vectorArrayFactory();

write(re, function tick() {
	re.set(mags)
	oo.ifft(output.buffer, re.buffer, im.buffer);
	// paintedSpectrum.push(output).render()
	write(output, tick)
})




// drag
on(paintedSpectrum.canvas, 'mousedown touchstart', e => {
	let lastX = e.x - 1, lastY = e.y

	draw(e)

	on(paintedSpectrum.canvas, 'mousemove.draw touchmove.draw', e => {
		draw(e)

		lastX = e.x
		lastY = e.y
	})
	on(paintedSpectrum.canvas, 'mouseup.draw touchend.draw mouseleave.draw', e => {
		off(paintedSpectrum.canvas, '.draw')
	})

	function draw (e) {
		for (let x = lastX, step = Math.sign(e.x - lastX); x != e.x; x += step) {
			let rx = x / paintedSpectrum.canvas.width
			let t = (x - lastX) / (e.x - lastX)
			let y = e.y * t + lastY * (1 - t)
			let ry = 1 - y / paintedSpectrum.canvas.height
			let fl = Math.floor(rx * mags.length)
			let fr = Math.ceil(rx * mags.length)
			for (let f = fl; f < fr; f++) {
				mags[f] = ry
			}
		}

		paintedSpectrum.set(mags).render()
		realSpectrum.render()
	}
})
