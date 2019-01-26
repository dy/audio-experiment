'use strict'

let osc = require('../audio-/oscillator')({
	f: 432, type: 'series', real: [0, 1, 0, 0, 0, 0, 0, 0, 1], normalize: true
})
let speaker = require('../audio-/speaker')({channels: 1})

function tick() {
	let data = osc()
	speaker(data, tick)
}

tick()
