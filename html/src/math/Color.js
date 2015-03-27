SQR.Color = function() {

	var c = {};

	var array;

	c.setRGB = function(r, g, b) {
		c.r = r || 0;
		c.g = g || 0;
		c.b = b || 0;
		return c;
	}

	c.setHex = function(hex) {

		hex = (hex.indexOf('#') == 0) ? hex.substring(1) : hex;
		hex = (hex.indexOf('0x') == -1) ? '0x' + hex : hex;
		hex = parseInt(hex);

		c.r = (hex >> 16 & 255 ) / 255;
		c.g = (hex >> 8 & 255) / 255;
		c.b = (hex & 255) / 255;

		return c;
	}

	c.copyFrom = function(oc) {
		c.r = oc.r;
		c.g = oc.g;
		c.b = oc.b;
		return c;
	}

	c.lighten = function(v) {
		// Naive approach for start, look here for more robust solutions:
		// http://stackoverflow.com/questions/141855/programmatically-lighten-a-color
		c.r = Math.min(1, c.r * v);
		c.g = Math.min(1, c.g * v);
		c.b = Math.min(1, c.b * v);
		return c;
	}

	c.clone = function() {
		return new SQR.Color().setRGB(c.r, c.g, c.b);
	}

	c.mul = function(v) {
		c.r = Math.min(1.0, c.r * v);
		c.g = Math.min(1.0, c.g * v);
		c.b = Math.min(1.0, c.b * v);
		return c;
	}

	c.toUniform = function(size) {

		if(!array) array = new Float32Array(3);

		array[0] = c.r;
		array[1] = c.g;
		array[2] = c.b; 

		return array;

	}

	return c;

}