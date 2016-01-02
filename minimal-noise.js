/**
 * Formants work perfectly, but now there is a question - what is the minimal unrecognizable noise pattern, how many seconds? To allocate proper memory for the formant.
 * And how many times it is possible to repeat noise?
 *
 * 1. 1 second (full buffer) seems to be ok to not be able to recognize repeats, depends on the noise. So just use that. It is extremely difficult to recognize such pattern.
 */

var AudioBuffer = require('audio-buffer');
var ctx = require('audio-context');
// var Spectrogram = require('audio-spectrogram');
var util = require('audio-buffer-utils');
var Generator = require('audio-generator');
var Speaker = require('audio-speaker');


var buf = util.noise(new AudioBuffer(ctx.sampleRate));

var src = ctx.createBufferSource();
src.buffer = buf;
src.loop = true;
src.connect(ctx.destination);
src.start();