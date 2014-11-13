SQR.TextureGenerator = {

	noise: function(w, h) {

		w = w || 512;
		h = h ||w;

		var c = document.createElement('canvas')
		c.width = w, c.height = h;

		var cx = c.getContext('2d');
		var d = cx.createImageData(w, h);
		var p = d.data;

		for (var i = 0, n = p.length; i < n; i += 4) {
		    p[i+0] = (Math.random() * 255) | 0;
		    p[i+1] = (Math.random() * 255) | 0; 
		    p[i+2] = (Math.random() * 255) | 0;
		    p[i+3] = 255;
		}

		cx.putImageData(d, 0, 0);

		return c;

	}

};


