AnimatedTexture = function(size, speed, baseOffset, scale) {

	var that = this;

	size = size || 256;
	speed = speed || 1;
	scale = scale || 4 / size;
	baseOffset = baseOffset || 0;

	var dist = size;

	var patch = document.createElement('canvas');

	var r = SQR.TextureGenerator.perlinNoise(size, size, null, 0, 255, scale, baseOffset);

	var data;

	this.canvas = r;

	this.move = function(t) {

		var ctx = r.getContext('2d');

		SQR.TextureGenerator.offset(r, -t, 0);
		
		if(t > 0) {
			SQR.TextureGenerator.perlinNoise(
				t, size, patch, 0, 255, scale, dist + baseOffset);

			ctx.drawImage(patch, size-t, 0);
		}

		dist += t;

		data = ctx.getImageData(0, 0, size, size).data;
	}

	var run = function() {
		requestAnimationFrame(run);
		that.move(speed);
	}

	this.start = function() {
		run();
	}

	this.getPixel = function(nx, ny) {
		var x = (nx * (size-1)) | 0;
		var y = (ny * (size-1)) | 0;
		var c =  data[(y * size + x) * 4];
		return c;
	}

	that.move(0);
}