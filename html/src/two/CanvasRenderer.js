/**
 *  @class CanvasRenderer
 *  @memberof SQR
 *
 *  @description Part of a minimal Canvas 2d rendering engine. The paremeter is a canvas element or a selector (ex. #gl-canvas) 
 *	can be passed to this function. If omitted a new canvas element will be created
 *	and it will be available as the canvas property of the object.
 *
 *	@param {HTMLCanvasElement} the underlying canvas element
 *	@property {HTMLCanvasElement} the underlying canvas element
 */
SQR.CanvasRenderer = function(canvas) {

	var r = {}, clearColor = null;

	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var ctx = canvas.getContext('2d');

	// Dash line shim
	if(!ctx.setLineDash) ctx.setLineDash = function() {};

	r.canvas = canvas;
	r.context = ctx;

	/** 
	 *	Set the size of the underlying canvas element.
	 *	@method setSize
	 *	@memberof SQR.CanvasRenderer.prototype
	 *	@param {Number} w - the width of the canvas
	 *	@param {Number} h - the height of the canvas
	 */
	r.setSize = function(w, h) {
		canvas.width = w;
		canvas.height = h;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		return r;
	}

	r.setClearColor = function(c) {
		clearColor = c;
		return r;
	}

	/**
	 *	Render the transform tree
	 *	@method render
	 *	@memberof SQR.CanvasRenderer.prototype
	 *	@param {SQR.Transform2d} root - the root transform to render
	 */
	r.render = function(root) {
		if(clearColor) {
			
			if(clearColor.indexOf('rgba') > -1) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}

			ctx.fillStyle = clearColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		} else {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		}
		

		if(root) root.draw(ctx);
	}

	return r;
}