/**
 * Subsampled noise experiment
 * Test whether it is possible to generate "filtered" noise by subsampling it.
 *
 * It works, in a way. But it does not accentuate harmonics.
 * Not clear how to bring it to formants. The answer is somewhere in filters area.
 */

var Generator = require('audio-generator');
var Speaker = require('audio-speaker');
var Spectrum = require('audio-spectrum');


var π = Math.PI;
var ππ = 2*π;

//throttle generation each this number of seconds
var interval = 0.5;
var count = 0;

function n() {
	return Math.random() * 2  - 1;
}

var i = 0;
var sample = 0;

Generator({
	samplesPerFrame: 512,
	generate: function (t) {
		i++;

		//apply interval callback
		if (t % interval < count) {

		}
		count = t % interval;

		// if (i % 1024*2 === 0) sample = n();
		// if (i % 1024 === 0) sample = n();
		// if (i % 512 === 0) sample = n();
		// if (i % 256 === 0) sample = n();
		// if (i % 128 === 0) sample = n();
		// if (i % 64 === 0) sample = n();
		// if (i % 32 === 0) sample = n();
		// if (i % 16 === 0) sample = n();
		// if (i % 8 === 0) sample = n();
		if (i % 997 === 0) sample = n();
		if (i % 983 === 0) sample = n();
		if (i % 977 === 0) sample = n();
		if (i % 971 === 0) sample = n();
		if (i % 967 === 0) sample = n();
		if (i % 953 === 0) sample = n();
		if (i % 947 === 0) sample = n();
		if (i % 941 === 0) sample = n();
		if (i % 937 === 0) sample = n();
		if (i % 929 === 0) sample = n();
		if (i % 919 === 0) sample = n();
		if (i % 911 === 0) sample = n();
		if (i % 907 === 0) sample = n();
		if (i % 887 === 0) sample = n();
		if (i % 881 === 0) sample = n();
		if (i % 883 === 0) sample = n();
		if (i % 823 === 0) sample = n();
		if (i % 827 === 0) sample = n();
		if (i % 829 === 0) sample = n();
		if (i % 853 === 0) sample = n();
		if (i % 857 === 0) sample = n();
		if (i % 859 === 0) sample = n();
		if (i % 863 === 0) sample = n();
		if (i % 877 === 0) sample = n();
		if (i % 839 === 0) sample = n();
		if (i % 809 === 0) sample = n();
		if (i % 577 === 0) sample = n();
		if (i % 587 === 0) sample = n();
		if (i % 593 === 0) sample = n();
		if (i % 599 === 0) sample = n();
		if (i % 601 === 0) sample = n();
		if (i % 607 === 0) sample = n();
		if (i % 613 === 0) sample = n();
		if (i % 617 === 0) sample = n();
		if (i % 619 === 0) sample = n();
		if (i % 631 === 0) sample = n();
		if (i % 641 === 0) sample = n();
		if (i % 643 === 0) sample = n();
		if (i % 647 === 0) sample = n();
		if (i % 653 === 0) sample = n();
		if (i % 659 === 0) sample = n();
		if (i % 661 === 0) sample = n();
		if (i % 673 === 0) sample = n();
		if (i % 677 === 0) sample = n();
		if (i % 683 === 0) sample = n();
		if (i % 691 === 0) sample = n();
		if (i % 701 === 0) sample = n();
		if (i % 709 === 0) sample = n();
		if (i % 719 === 0) sample = n();
		if (i % 727 === 0) sample = n();
		if (i % 733 === 0) sample = n();
		if (i % 739 === 0) sample = n();
		if (i % 743 === 0) sample = n();
		if (i % 751 === 0) sample = n();
		if (i % 757 === 0) sample = n();
		if (i % 761 === 0) sample = n();
		if (i % 769 === 0) sample = n();
		if (i % 773 === 0) sample = n();
		if (i % 787 === 0) sample = n();
		if (i % 797 === 0) sample = n();
		if (i % 809 === 0) sample = n();
		if (i % 811 === 0) sample = n();
		// if (i % 5 === 0) sample = n();
		// if (i % 3 === 0) sample = n();
		// if (i % 2 === 0) sample = n();

		// sample = Math.sin(π*2*10*t)

		return sample;
	},
	duration: 4
})
.pipe(Spectrum({fftSize: 256, frequencyBinCount: 128, smoothingTimeConstant: 0.9}).on('render', function (canvas) {console.log(canvas._canvas.frame())}))
.pipe(Speaker());