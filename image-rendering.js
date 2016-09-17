/**
 * Custom audio processing, especially with formants and with the way to css, is a kind of difficult.
 * Is it possible to treat sound as image data and handle it in canvas?
 * We map RGB to f subbands (which is doubtful)
 * or better HSL to formants.
 * 	- Is it enough 360 values of hue to cover all distinctive frequencies?
 * 	- Is it enough 100 values of saturation to distinct purity?
 * 	- Is it enough 100 values of lightness to distinct amplitude?
 * 	Sounds like yes.
 */
