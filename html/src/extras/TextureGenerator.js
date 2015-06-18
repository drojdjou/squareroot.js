/**
 *  @class TextureGenerator
 *  @memberof SQR
 *
 *  @description Utility to generate procedural textures
 */
 SQR.TextureGenerator = {


 	generate: function(w, h, canvas, genFunc) {

		w = w || 512;
		h = h || w;

		var c = canvas || document.createElement('canvas')
		c.width = w, c.height = h;

		var cx = c.getContext('2d');
		var d = cx.createImageData(w, h);
		var p = d.data;

		c.context = cx;

		for (var i = 0, n = p.length; i < n; i += 4) {
			var t = i / 4;
		    genFunc(p, i, t % w + 1, ((t / w) | 0) + 1);
		}

		cx.putImageData(d, 0, 0);

		return c;
 	},

 	offset: function(canvas, ox, oy) {
 		var cx = canvas.getContext('2d');
 		var w = canvas.width, h = canvas.height;
		var d = cx.getImageData(0, 0, w, h);
		cx.clearRect(0, 0, w, h);
		cx.putImageData(d, ox, oy);
 	},

 	/**
 	 *	Returns a noise texture
 	 *
 	 *	@param {Number} w - the width of the texture, default 512
 	 *	@param {Number} h - the height of the texture, default 512
 	 *	@param {HTMLCanvasElement} canvas - a canvas to draw the texture on, if omitted a new one is created
 	 *	@param {Number} min - minimum color value for r,g,b channels [0-255], alpha is always 255
 	 *	@param {Number} max - maximum color value for r,g,b channels [0-255], alpha is always 255
 	 */
	noise: function(w, h, canvas, min, max) {

		min = min || 0;
		max = max || 255;

		return SQR.TextureGenerator.generate(w, h, canvas, function(p, i) {
		    p[i+0] = min + (Math.random() * (max - min)) | 0;
		    p[i+1] = min + (Math.random() * (max - min)) | 0; 
		    p[i+2] = min + (Math.random() * (max - min)) | 0;
		    p[i+3] = 255;
		});

	},

	perlinNoise: function(w, h, canvas, min, max, scale, ox, oy) {

		min = min || 0;
		max = max || 255;
		scale = scale || 0.1;
		ox = ox || 0;
		oy = oy || 0;

		return SQR.TextureGenerator.generate(w, h, canvas, function(p, i, x, y) {
			var n = SQR.PerlinNoise.noise(
				(ox + x) * scale, 
				(oy + y) * scale, 
				0);

			n = (n + 1) / 2;

		    p[i+0] = min + (n * (max - min)) | 0;
		    p[i+1] = min + (n * (max - min)) | 0; 
		    p[i+2] = min + (n * (max - min)) | 0;
		    p[i+3] = 255;
		});
	}

};


