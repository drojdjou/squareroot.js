SQR.Primitives.create2DQuad = function(x, y, w, h) {

	return SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
        .data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
        .update();

}

SQR.Primitives.createPlane = function(w, h, sw, sh, ox, oy) {
	// TODO: implement
}