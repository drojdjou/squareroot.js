/**
 *  @class CanvasRenderer
 *  @memberof SQR
 *
 *  @description Part of a minimal Canvas 2d rendering engine.
 *	
 */
SQR.CanvasRenderer = function(canvas) {

	var r = {};

	var BADCTX = "> SQR.Context - Invalid canvas reference.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);
	if(!canvas.getContext) throw BADCTX;

	var ctx = canvas.getContext('2d');

	r.canvas = canvas;

	r.setSize = function(w, h) {
		canvas.width = w;
		canvas.height = h;
	}

	r.render = function(root) {
		ctx.clearRect(0, 0, w, h)
		root.draw(ctx);
	}

	return r;
}