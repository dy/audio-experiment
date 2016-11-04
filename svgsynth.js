//how does it sound square
const Gen = require('audio-generator/stream');
const Out = require('audio-speaker/stream');
const len = require('mumath/len')
const Wf = require('../gl-waveform/2d')
const Through = require('audio-through')


let wf = Wf();


let ns = `http://www.w3.org/2000/svg`
var svg = document.createElementNS(ns, "svg");
svg.setAttribute('width', '200px');
svg.setAttribute('height', '200px');
svg.setAttribute('viewBox', '-1 -1 2 2');
// svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
document.body.appendChild(svg);

svg.style.zIndex = 1;
svg.style.position = 'relative';


var shape = document.createElementNS(ns, "path");
shape.setAttribute("stroke", "white");
shape.setAttribute("fill", "transparent");
shape.setAttribute("stroke-width", "0.05");
svg.appendChild(shape);

//square
// shape.setAttribute("d",  'M 1 1 L 1 -1 L -1 -1 L -1 1 z');

//triangle
// shape.setAttribute("d",  'M 0 1 L 1 -1 L -1 -1 z');

//star
shape.setAttribute("d",  'M 0 1 L .2 .3 L 1 .3 L .35 -.1 L 1 -1 L 0 -.3 L -1 -1 L -.35 -.1 L -1 .3 L -.2 .3 Z');


let l = shape.getTotalLength();
let f = 440;
let diag = Math.sqrt(2);
let τ = Math.PI * 2;

Gen(t => {
	let {x, y} = shape.getPointAtLength( (t*l*f) % l);
	let amp = len(x, y)/diag;
	let angle = t*τ*f;
	return amp * Math.sin(angle);
	// return Math.sin(f*Math.PI*2*t)
})
.pipe(Through(chunk => {
	wf.push(chunk.getChannelData(0));
}))
.pipe(Out());
