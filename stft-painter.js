import Waveform from 'gl-waveform'
import {on, off, emit} from 'emmy'
import Writer from 'web-audio-write'
import OO from 'ooura'

let wf = Waveform()

// FIXME: this value
let write = Writer({samplesPerFrame: 256})


const FFT_SIZE = 512
let spectrum = new Float64Array(FFT_SIZE)
spectrum[2] = 1
wf.set(spectrum).render()

// Set up the FFT
let oo = new OO(spectrum.length, {"type":"real", "radix":4});
let output = oo.scalarArrayFactory();
let re = oo.vectorArrayFactory();
let im = oo.vectorArrayFactory();

write(re, function tick() {
	oo.ifft(output.buffer, spectrum.buffer, im.buffer);
	// wf.push(output).render()
	write(output, tick)
})



// drag
on(wf.canvas, 'mousedown touchstart', e => {
	let lastX = null, lastY = null

	on(wf.canvas, 'mousemove.draw touchmove.draw', e => {
		if (lastX == null) lastX = e.x, lastY = e.y

		for (let x = lastX, step = Math.sign(e.x - lastX); x != e.x; x += step) {
			let rx = x / wf.canvas.width
			let t = (x - lastX) / (e.x - lastX)
			let y = e.y * t + lastY * (1 - t)
			let ry = 1 - y / wf.canvas.height
			let f = Math.round(rx * spectrum.length)
			spectrum[f] = ry
		}

		wf.set(spectrum).render()

		lastX = e.x
		lastY = e.y
	})
	on(wf.canvas, 'mouseup.draw touchend.draw mouseleave.draw', e => {
		off(wf.canvas, '.draw')
	})
})
