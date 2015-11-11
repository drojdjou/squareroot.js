/**
 *  @class PerlinTexture
 *  @memberof SQR
 *
 *  @description Utility to generate procedural textures based on Perlin noise.
 */
SQR.PerlinTexture = function(canvas, options) {

	var BADCTX = "> SQR.PerlinTexture - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var tt = {
		offset: new SQR.V3(0, 0, 0),
		canvas: canvas
	};

	var ctx, width, height, data;

	var interpolate = function(v, s, e) {
		if(v <= s) return 0;
		if(v >= e) return 1;
		return (v - s) / (e - s);
	}

	tt.create = function(w, h, noCanvas) {
		width = w | 0;
		height = h | 0 || w;

		if(!noCanvas) {
			ctx = canvas.getContext('2d');
			canvas.width = width;
			canvas.height = height;
			data = ctx.getImageData(0, 0, width, height);
		}

		return tt;
	}

	tt.configure = function(c) {
		// low, high, octaves, factors, seed, offset
		c.low = c.low || 0;
		c.high = c.high || 0;
		c.octaves = c.octaves || [1];
		c.factors = c.factors || [1];
		c.seed = c.seed || 0;
		tt.config = c;

		SQR.PerlinNoise.seed(c.seed);

		return tt;
	}	

	tt.setOffset = function(x, y, z) {
		tt.offset.set(x, y, z);
		return tt;
	}

	tt.getValue = function(x, y) {
		var col = 0;
		var cf = tt.config;
		var ol = cf.octaves.length;

		for(var k = 0; k < ol; k++) {

			var c = SQR.PerlinNoise.simplex3(
				(x + tt.offset.x * cf.factors[k]) / height * cf.octaves[k],
				(y + tt.offset.y * cf.factors[k]) / width * cf.octaves[k],
				tt.offset.z
			);

			c = (c + 1) * 0.5; // Get it to [0-1]
			c = c * cf.factors[k];

			col += c;
		}

		col = col / ol;
		col = interpolate(col, cf.low, cf.high);
		return col;
	}

	tt.getPixel = function(x, y) {
		var i = (y * width + x) * 4;
		return data.data[i+0] / 255; // Just return red
	}

	tt.draw = function() {

		var l = width * height * 4;
		for(var i = 0; i < l; i += 4) {

			var px = (i/4) % width;
			var py = (i/4) / height;
			var col = tt.getValue(px, py);

			col = (col * 255) | 0;

			data.data[i+0] = col;
			data.data[i+1] = col;
			data.data[i+2] = col;

			data.data[i+3] = 255;
			
		}
		
		ctx.putImageData(data, 0, 0);

		return tt;
	}

	return tt;
}