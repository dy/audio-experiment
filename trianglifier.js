/**
 * q1: how does it sound trianglified sound source
 * i.e. lines connecting the extremums
 * I guess something like bit-crusher?
 *
 * q2: how does it sound polygonal-approximated sound by some ranges
 */
const createWaveform = require('../gl-waveform')
const createPanel = require('../settings-panel')
const extend = require('object-assign')

const util = require('audio-buffer-utils')
const lena = require('audio-lena/buffer')
const Through = require('audio-through')
const Source = require('audio-source/stream')
const Speaker = require('audio-speaker/stream')
const Generator = require('audio-generator/stream')

let opts = {
	mute: false,
	level: 0,
	depth: 1
}

let trianglify = Trianglify(opts)


let levelCanvas = document.body.appendChild(document.createElement('canvas'))
levelCanvas.width = 100
levelCanvas.height = 100
levelCanvas.style.cssText = `
	position: absolute;
	z-index: 1;
	top: 0;
	right: 0;
	outline: 1px solid rgba(0,0,0,.1);
`;

function drawLevel(level) {
	let ctx = levelCanvas.getContext('2d')

	ctx.clearRect(0,0,200,200)
	ctx.strokeStyle = 'red'
	ctx.strokeWidth = 2

	let w = levelCanvas.width, h = levelCanvas.height
	let cw = levelCanvas.width/2, ch = levelCanvas.height/2

	ctx.beginPath()
	ctx.moveTo(0, ch - ch * level/2)
	ctx.lineTo(w, ch + ch * level/2)
	ctx.closePath()
	ctx.stroke()
}

let panel = createPanel([{
	id: 'depth',
	type: 'range',
	value: opts.depth,
	min: 1,
	max: 10,
	hidden: true,
	change: v => {

	}
}, {
	id: 'level',
	type: 'range',
	min: -.05,
	max: .05,
	step: .0005,
	value: opts.level,
	change: v => {
		opts.level = v
		drawLevel(v)
		//TODO: add trend render at the corner
	}
}, {
	id: 'mute',
	type: 'toggle',
	value: false,
	change: v => {
		opts.mute = v
	}
}], {
	title: '<a href="https://github.com/dy/audio-experiment">Trianglifier</a>',
	css: `
	:host {
		z-index: 1;
		background: none;
	}
	`
})

let wf = createWaveform({palette: ['white', 'black']});


Source(lena, {channels: 1, samplesPerFrame: 2048, loop: true})
// Generator((t) => {
// 	return Math.cos(Math.PI * 2 * 440 * t)
// }, {duration: 2})

//map chunks via trianglifier
.pipe(Through(trianglify, {samplesPerFrame: 2048}))

//render
.pipe(Through(chunk => {
	wf.push(chunk.getChannelData(0));
}))
.pipe(Speaker({ samplesPerFrame: 2048}));



function Trianglify (opts) {
	if (!opts) opts = {}

	//trend level, -2..+2
	if (opts.level == null) opts.level = 0

	if (opts.depth == null) opts.depth = 1

	return function trianglify (chunk) {
		let target = util.shallow(chunk)
		let channels = chunk.numberOfChannels
		let level = opts.level

		if (opts.mute) return chunk

		for (let c = 0; c < channels; c++) {
			let data = chunk.getChannelData(c)
			let targetData = target.getChannelData(c)

			let ptr = 0
			let extremum = data[ptr]

			for (let i = 1, l = data.length; i < l; i++) {
				let curr = data[i],
					prev = data[i-1],
					next = data[i+1]

				//local max/min or end of sequence
				if ((i === l-1) ||
					((next - curr > level) && (curr - prev <= level)) ||
					((next - curr < level) && (curr - prev >= level))) {
					let n = i - ptr
					let trend = (curr - extremum) / n

					for (let j = ptr; j <= i; j++) {
						targetData[j] = extremum + trend * (j - ptr)
					}

					extremum = curr
					ptr = i
				}
			}
		}

		return target
	}


	/*
	if (mute) return chunk;

	let samples = chunk.getChannelData(0)

	//once we get an extremum, we can feed the chunk of appropriate length to output

	let accum = []

	let dif, prevDif, curr, prev = 0, lastPtr = 0, lastValue = 0

	for (let i = 0; i < samples.length; i++) {
		curr = samples[i]
		dif = curr - prev

		//if extremum found
		if ((dif > level && prevDif <= level) || (dif < level && prevDif >= level)) {
			//calculate trend
			trend = (prev - lastValue) / (i - 1 - lastPtr)

			//push line approximation to accumulator
			for (let i = 0; i < len; i++) {
				let value = lastValue + trend * (i - lastPtr)
				accum.push(value)
			}
		}

		prev = curr
		prevDif = dif

	}

	//if there is enough data - feed chunk
	if (accum.length >= len) {
		let data = accum.shift()
		ready(data)
	}
	*/
}
