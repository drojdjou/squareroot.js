/**
 *  @class Color
 *  @memberof SQR
 *
 *  @descrption represents an RGB color. This class works with float values, 
 *	so all the color components are in range of 0-1, not 0-255.
 *
 *	@param {Number=} r the red component of the color
 *	@param {Number=} g the green component of the color
 *	@param {Number=} b the blue component of the color
 *	@param {Number=} a the transparency (alpha) component of the color
 *
 */
SQR.Color = function(r, g, b, a) {
	if(!(this instanceof SQR.Color)) return new SQR.Color(r, g, b, a);
	
	if(typeof(r) == 'string') {
		this.setHex(r);
		this.a = (g == undefined) ? 1 : g; // if r is a hex color code, the next argument will be alpha
	} else if(r && r.r != undefined) {
		this.setRGB(r.r, r.g, r.b);

		if(r.a != undefined) this.a = r.a;
		else if(g != undefined) this.a = g;
		else this.a = 1; 

	} else {
		this.setRGB(r, g, b);
		this.a = (a == undefined) ? 1 : a;
	}
}

/**
 *	@method setRGB
 *	@memberof SQR.Color.prototype
 *
 *	@description sets the color component values.
 *
 *	@param {Number=} r the red component of the color
 *	@param {Number=} g the green component of the color
 *	@param {Number=} b the blue component of the color
 *
 *	@returns {Object} reference to this SQR.Color instance, for chaining
 */
SQR.Color.prototype.setRGB = function(r, g, b) {
	var c = this;
	c.r = r || 0;
	c.g = g || 0;
	c.b = b || 0;
	return c;
}

/**
 *	@method setHex
 *	@memberof SQR.Color.prototype
 *
 *	@description sets the color component values from a hex string (ex. #a4d278) or number (ex. 0xa4d278) 
 *	Useful when copying color vaues from ex. Photoshop.
 *
 *	@param {string|Number} hex the hex color values as string (ex. #a4d278) or number (ex. 0xa4d278) 
 *
 *	@returns {Object} reference to this SQR.Color instance, for chaining
 */
SQR.Color.prototype.setHex = function(hex) {

	var c = this;

	if(typeof(hex) == 'string') {
		hex = (hex.indexOf('#') == 0) ? hex.substring(1) : hex;
		hex = (hex.indexOf('0x') == -1) ? '0x' + hex : hex;
		hex = parseInt(hex);
	}

	c.r = (hex >> 16 & 255 ) / 255;
	c.g = (hex >> 8 & 255) / 255;
	c.b = (hex & 255) / 255;

	return c;
}

/**
 *	@method toCSS
 *	@memberof SQR.Color.prototype
 *
 *	@returns {string} a CSS friendly string representing the color. The format used is <code>rgb(r, g, b)</code>.
 */
SQR.Color.prototype.toCSS = function() {
	var c = this;
	var ri = (c.r * 255) | 0;
	var gi = (c.g * 255) | 0;
	var bi = (c.b * 255) | 0;
	var ai = c.a ? ', ' + c.a.toPrecision(2) : '';
	var h = c.a ? 'rgba' : 'rgb';
	return h + '(' + ri + ', ' + gi + ', ' + bi + '' + ai + ')';
}

/**
 *	@method setRGB
 *	@memberof SQR.Color.prototype
 *
 *	@description copies the color component values from another instance of SQR.Color
 *
 *	@param {SQR.Color} oc the color instance to copy from
 *
 *	@returns {Object} reference to this SQR.Color instance, for chaining
 */
SQR.Color.prototype.copyFrom = function(oc) {
	var c = this;
	c.r = oc.r;
	c.g = oc.g;
	c.b = oc.b;
	return c;
}

/**
 *	@method lighten
 *	@memberof SQR.Color.prototype
 *
 *	@description <p>modfies the color values to make them darker of lighter in a more fance way than a simple multiplication. 
 *	However this is not currently implemented so for now it really does the same thing as <code>SQR.Color.mul</code>.</p>
 *
 *	<p>Here's <a href='http://stackoverflow.com/questions/141855/programmatically-lighten-a-color'>some info on how to implement this properly</a>.</p>
 */
SQR.Color.prototype.lighten = function(v) {
	return this.mul(v);
}

/**
 *	@method clone
 *	@memberof SQR.Color.prototype
 *
 *	@description creates a copy of the color instance
 *
 *	@returns {Object} a new SQR.Color instance
 */
SQR.Color.prototype.clone = function() {
	return new SQR.Color(c.r, c.g, c.b);
}

/**
 *	@method mul
 *	@memberof SQR.Color.prototype
 *
 *	@description modfies the color values to make it darker of lighter
 *
 *	@param {Number} v the amount by which to change the color (1 will leave it as it, > 1 will lightned, < 1 will darken the color)
 *
 *	@returns {Object} reference to this SQR.Color instance, for chaining
 */
SQR.Color.prototype.mul = function(v) {
	var c = this;
	c.r = Math.min(1.0, c.r * v);
	c.g = Math.min(1.0, c.g * v);
	c.b = Math.min(1.0, c.b * v);
	return c;
}

/**
 *	@method lerp
 *	@memberof SQR.Color.prototype
 *
 *	@description performs a linear interpolation between two colors and stores the value in the color instance
 *
 *	@param {SQR.Color} a the first color to use in interpolation
 *	@param {SQR.Color} b the second color to use in interpolation
 *	@param {Number} t the interpolation value [0-1]
 *
 *	@returns {Object} reference to this SQR.Color instance, for chaining
 */
SQR.Color.prototype.lerp  = function(a, b, t) {
	var c = this;
	var m = 1 - t;
	c.r = a.r * m + b.r * t;
	c.g = a.g * m + b.g * t;
	c.b = a.b * m + b.b * t;
	return c;
}

SQR.Color.prototype.toUniform = function(type) {

	var alpha = type == SQR.gl.FLOAT_VEC4;

	var c = this;
	if(!c._array) c._array = new Float32Array(alpha ? 4 : 3);
	c._array[0] = c.r;
	c._array[1] = c.g;
	c._array[2] = c.b; 
	if(alpha) c._array[3] = c.a;
	return c._array;
}






