SQR.SpriteSheet = function() {

	var s = {};
	var rows, cols, size, options;

	var cnv = document.createElement('canvas');
	var ctx = cnv.getContext('2d');

	s.canvas = cnv;

	s.layout = function(_rows, _cols, _size) {
		rows = _rows, cols = _cols, size = _size;
		cnv.width = cols * size;
		cnv.height = rows * size;
		s.numFrames = rows * cols;
		s.rows = rows;
		s.cols = cols;
		s.size = size;
		return s;
	}

	s.options = function(_options) {
		options = _options;
		return s;
	}

	s.renderToCanvas = function(context, frame) {
		var row = cols == 1 ? frame : Math.floor(frame / cols);
		var col = frame % cols;

		context.drawImage(cnv, 
			col * size, row * size, size, size, 
			0, 0, size, size);
	}

	s.draw = function(callback) {

		if(options && options.bgcolor !== undefined) {
			ctx.fillStyle = options.bgcolor;
			ctx.fillRect(0, 0, cols * size, rows * size);
		} else {
			ctx.fillStyle = 'rgba(0, 0, 0, 0)'
			ctx.fillRect(0, 0, cols * size, rows * size);
		}

		if(!callback) return s;
		for(var y = 0; y < rows; y++) {
			for(var x = 0; x < cols; x++) {
				ctx.save();
				var yp = (options && options.webglFlipY) ? (rows-y-1) * size : y * size;
				ctx.translate(x * size, yp);
				callback(ctx, y * cols + x, s.numFrames);
				ctx.restore();
			}
		}

		return s;
	}

	return s;
}