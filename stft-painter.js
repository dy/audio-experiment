import Waveform from 'gl-waveform'
import State from 'st8'
import e from 'emmy'

let wf = Waveform()

const FFT_SIZE = 4096
let spectrum = new Array(FFT_SIZE)


var isPressed = false

wf.canvas.add

let penState = State({
	idle: [
		() => {
			wf.canvas.addEventListener('mousedown', () => {
				penState.set('pressed')
			})
		},
		() => {

		}
	],

	pressed: [
		() => {
			wf.canvas.addEventListener('mouseup', () => {
				penState.set('idle')
			})
			wf.canvas.addEventListener('mousemove', () => {

			})
		},
		() => {

		}
	]
})


// wf.set(spectrum)


function ifft(mags) {

}
