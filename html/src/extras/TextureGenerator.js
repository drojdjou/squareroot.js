SQR.TextureGenerator = {

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


