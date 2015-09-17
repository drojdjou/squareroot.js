SQR.TerrainTexture = function(size, low, high, octaves, factors, seed, offset) {

	var tt = {};
	seed = seed || 0;

	var interpolate = function(v, s, e) {
		if(v <= s) return 0;
		if(v >= e) return 1;
		return (v - s) / (e - s);
	}

	tt.canvas = document.createElement('canvas');
	var ctx = tt.canvas.getContext('2d');
	tt.canvas.width = size;
	tt.canvas.height = size;

	tt.data = [];

	tt.getValue = function(x, y) {
		var col = 0;

		for(var k = 0; k < octaves.length; k++) {

			var c = SQR.PerlinNoise.noise(
				(x + offset.x) / size * octaves[k],
				(y + offset.y) / size * octaves[k],
				seed
			);

			c = (c + 1) * 0.5;
			c = c * c * c;
			c = c * factors[k];

			col += c;
		}

		col = interpolate(col, low, high);
		return col;
	}

	var data = ctx.getImageData(0, 0, size, size);
	
	for(var i = 0; i < data.data.length; i += 4) {
		var px = (i/4) % size;
		var py = ((i/4) / size) | 0;

		data.data[i+0] = 0;
		data.data[i+1] = 0;
		data.data[i+2] = 0;
		data.data[i+3] = 255;

		var col = tt.getValue(px, py);
		
		tt.data.push(col);

		col = (col * 255) | 0;
		data.data[i+0] = col;
		data.data[i+1] = col;
		data.data[i+2] = col;
		
	}
	

	ctx.putImageData(data, 0, 0);

	return tt;
}