SQR.Color = function() {

	var c = {};

	var array;

	c.setRGB = function(r, g, b) {
		c.r = r || 0;
		c.g = g || 0;
		c.b = b || 0;
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