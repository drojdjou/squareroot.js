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

	var r = {};

	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var ctx = canvas.getContext('2d');

	r.canvas = canvas;

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
	}

	/**
	 *	Render the transform tree
	 *	@method render
	 *	@memberof SQR.CanvasRenderer.prototype
	 *	@param {SQR.Transform2d} root - the root transform to render
	 */
	r.render = function(root) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		root.draw(ctx);
	}

	return r;
}