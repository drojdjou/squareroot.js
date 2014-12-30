/**
 *  @method createPoint
 *  @memberof SQR.Primitives
 *
 *  @description Creates a single 2d point
 *
 *	@param {Number} x - x position of the point
 *	@param {Number} y - y position of the point
 *
 *	@returns {SQR.Buffer}
 */
SQR.Primitives.createPoint = function(x, y) {
	return SQR.Buffer()
		.layout(SQR.v2(), 1)
		.setMode(SQR.gl.POINTS)
		.data('aPosition', x || 0, y || 0)
		.update();
}