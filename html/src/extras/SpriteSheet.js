/**
 *  @class SpriteSheet
 *  @memberof SQR
 *
 *  @description Utility to create sprite sheets for 2d animations.
 *	See avaialble code samples:
 *	<ul>
 *		<li><a href="../tutorials/sprite-sheet.html">rendering a sprite sheet on canvas 2d</a></li>
 *		<li>rendering a sprite sheet in webgl (coming soon)</li>
 *	</ul>
 *
 *	@property {HTMLCanvasElement} canvas - the canves on which the sprite-sheet is drawn
 *	@property {Number} numFrames - the number for frames (rows x cols)
 *	@property {Number} rows - the number of rows as defined in {@link SQR.SpriteSheet#layout}
 *	@property {Number} columns - the number of columns as defined in {@link SQR.SpriteSheet#layout}
 *	@property {Number} size - the size of the sprite sheet square as defined in {@link SQR.SpriteSheet#layout}
 */
SQR.SpriteSheet = function() {

	var s = {};
	var rows, cols, size, options;

	var cnv = document.createElement('canvas');
	var ctx = cnv.getContext('2d');

	s.canvas = cnv;
	s.frame = 0;

	/**
	 *	Define the layout of the sprite sheet. The number of rows and columns is
	 *	arbitary, but it impacts the number of frames in the animaction, which is 
	 *	equal to the number product of those values (cols x rows). Typically it's better 
	 *	to create balanced sprite sheets that have roughly the same amount of rows as columns,
	 *	and avoid creating very long sheets iwth ex lots of rows and only one column. Thanks to this
	 *	you can avoid hitting the max canvas size limitation, esp on mobile.
	 *
	 *	Another limitations is that currently all cells need to be square and are defined by a single 
	 *	size value below. Since it's not optimal for rectangular animations, future versions will 
	 *	implement both width and height separately.
	 *
	 *	@param {Number} _rows - the number of rows in the spritesheet
	 *	@param {Number} _cols - the number of columns in the spritesheet
	 *	@param {Number} _size - the size of each cell. All cells in spritesheets are square
	 *
	 *	@method layout
	 *	@memberof SQR.SpriteSheet.prototype
	 */
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

	/**
	 *	Set misc options for the spritesheet, which include:
	 *	<ul>
	 *		<li>bgcolor - a css color to use as background (default is transparent)</li>
	 *		<li>webglFlipY - set to true if spritesheet is used as webgl texture</li>
	 *	</ul>
	 *
	 *	@method options
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.options = function(_options) {
		options = _options;
		return s;
	}

	/**
	 *	Draws a single frame to a canvas element. Can be used manually, but typically using
	 *	`run` below is recommended. The `run` function returns this function but wraps it in a
	 *	closure with a `setInterval` call for continous animated rendering.
	 *
	 *	@param {CanvasRenderingContext2D} context - context 2d of the canvas to draw the sprite to 
	 *	@param {Number} frame - the frame number to draw
	 *
	 *	@method renderToCanvas
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.renderToCanvas = function(context, frame) {
		var row = cols == 1 ? frame : Math.floor(frame / cols);
		var col = frame % cols;

		context.translate(size / -2, size / -2);

		context.drawImage(cnv, 
			col * size, row * size, size, size, 
			0, 0, size, size);
	}

	/**
	 *	The srite sheet drawing function. 
	 *	The drawing function receives the following parameters:
	 *
	 *	<ul>
	 *		<li>ctx - the context of the sprite sheet canvas to draw on</li>
	 *		<li>frame - the number of the frame to draw</li>
	 *	</ul>
	 *
	 *	On top of that 
	 *
	 *	The drawing is called for each frame of the sprite sheet and expects that the 
	 *	implementing code will draw each consecivute frame at each call.
	 *
	 *	The context already comes transformed (translated) onto the current spot
	 *	for the given frame, so just start drawing at 0,0. The center of the sprite
	 *	is at size/2 x size/2.
	 *
	 *	@param {function} callback - the implementation of the drawing function
	 *
	 *	@method draw
	 *	@memberof SQR.SpriteSheet.prototype
	 */
	s.draw = function(callback) {

		if(options && options.bgcolor !== undefined) {
			ctx.fillStyle = options.bgcolor;
			ctx.fillRect(0, 0, cols * size, rows * size);
		} else {
			ctx.fillStyle = 'rgba(0, 0, 0, 0)';
			ctx.fillRect(0, 0, cols * size, rows * size);
		}

		if(!callback) return s;
		for(var y = 0; y < rows; y++) {
			for(var x = 0; x < cols; x++) {
				ctx.save();
				var yp = (options && options.webglFlipY) ? (rows-y-1) * size : y * size;
				ctx.translate(x * size, yp);
				callback.call(this, ctx, y * cols + x);
				ctx.restore();
			}
		}

		return s;
	}

	/**
	 *	Assign the return value of this function to the {@link SQR.Transform2d} shape
	 *	property for rendering. See {@tutorial canvas-rendering} for details.
	 *
	 *	@method run
	 *	@memberof SQR.SpriteSheet.prototype
	 *
	 *	@param {Number} framerate - the frame rate of the animation in ms (default 1000/60, i.e. 60FPS)
	 *	@param {Number} loop - number of times the animation should loop. (default -1, i.e. infinite) 
	 *
	 *	@return {Function} rendering function (renderToCanvas above) that can be used as shape property of {@link SQR.Transform2d} instance. 
	 *	The function has a propeorty called 'stop' which is also a function and can be called anytime to halt the animation.
	 *
	 *	@example
// Assumes the sheet is draw and ready to use (see link to example above)
var sheet = SQR.SpriteSheet();

// Create a host transform
var sprite = new SQR.Transform2d();
sprite.position.set(100, 100);

// Run at 30fps, loop 10 times.
sprite.shape = sheet.run(1000/30, 10);
	 */
	s.run = function(framerate, loop) {
		var f = 0, l = loop || -1;
		console.log(l);
		framerate = framerate || 1000/60;

		var runner = function(ctx) {
			s.renderToCanvas(ctx, f);
		}

		var intervalId = setInterval(function() {
			f++;
			if(f >= sheet.numFrames) {
				if(l != 0) {
					f = 0;
					l--;
				} else {
					runner.stop();
				}
			}
		}, framerate);

		runner.stop = function(runner) {
			clearInterval(intervalId);
		}

		return runner;
	}

	return s;
}