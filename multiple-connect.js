// https://github.com/g200kg/webaudio-customnode
// states that we can connect multiple nodes to gain node
// that contradicts to the spec
// let's test out
// whoa, it does work. Amazing.

import random from 'gauss-random'

let ctx = new AudioContext()

let gain = new GainNode(ctx, {gain: .1})

let osc1 = new OscillatorNode(ctx, {type: 'sine', frequency: 69})
let osc2 = new OscillatorNode(ctx, {type: 'sine', frequency: 71})

osc1.start()
osc2.start()

let processorNode = ctx.createScriptProcessor(4096, 1, 1);
processorNode.onaudioprocess = function(e) {
	let data = e.inputBuffer.getChannelData(0)
	// for (let i = 0; i < data.length; i++) {
	// 	data[i] = Math.max(-1, Math.min(1, data[i]))
	// }
	e.outputBuffer.getChannelData(0).set(e.inputBuffer.getChannelData(0))

}
setInterval(() => {
	// every frame randomly change input2
	let v = parseFloat(input2.value)
	v += random()
	input2.value = v
	input2.dispatchEvent(new Event('input'));


	v = parseFloat(input.value)
	v += random() * .02
	input.value = v
	input.dispatchEvent(new Event('input'));
}, 100)

gain.connect(ctx.destination)
// processorNode.connect(ctx.destination)
osc1.connect(gain)
osc2.connect(gain)


let input = document.body.appendChild(document.createElement('input'))
input.type = 'range'
input.min = 0.05
input.max = 100
input.value = gain.gain.value
input.step = .001
input.style.width = '100%'
input.addEventListener('input', e => {
	gain.gain.value = input.value
	gain2.gain.value = input.value * .2
})

// setTimeout(function () {
// 	osc1.stop()
// 	osc2.stop()
// 	osc1.disconnect()
// 	osc2.disconnect()
// 	processorNode.disconnect()
// }, 1000)

let ratio = 1.2
let osc3 = new OscillatorNode(ctx, {type: 'sine', frequency: 369})
let osc4 = new OscillatorNode(ctx, {type: 'sine', frequency: osc3.frequency.value * ratio})
let gain2 = new GainNode(ctx, {gain: .05})

osc3.start()
osc4.start()
osc3.connect(gain2)
osc4.connect(gain2)
gain2.connect(ctx.destination)


let input2 = document.body.appendChild(document.createElement('input'))
input2.type = 'range'
input2.min = 350
input2.max = 420
input2.value = osc3.frequency.value + 1
input2.step = .1
input2.style.width = '100%'
input2.addEventListener('input', e => {
	let v = parseFloat(input2.value)
	osc3.frequency.value = v - 1
	osc4.frequency.value = v * ratio + 1
})
