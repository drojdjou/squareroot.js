SQR.Primitives.createPoint = function(x, y) {
	return SQR.Buffer()
		.layout(SQR.v2(), 1)
		.setMode(SQR.gl.POINTS)
		.data('aPosition', x || 0, y || 0)
		.update();
}