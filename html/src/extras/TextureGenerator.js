/**
 *  @class TextureGenerator
 *  @memberof SQR
 *
 *  @description Utility to generate procedural textures
 */
 SQR.TextureGenerator = {

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

		w = w || 512;
		h = h || w;

		min = min || 0;
		max = max || 255;

		var c = canvas || document.createElement('canvas')
		c.width = w, c.height = h;

		var cx = c.getContext('2d');
		var d = cx.createImageData(w, h);
		var p = d.data;

		for (var i = 0, n = p.length; i < n; i += 4) {
		    p[i+0] = min + (Math.random() * (max - min)) | 0;
		    p[i+1] = min + (Math.random() * (max - min)) | 0; 
		    p[i+2] = min + (Math.random() * (max - min)) | 0;
		    p[i+3] = 255;
		}

		cx.putImageData(d, 0, 0);

		return c;

	},

};


