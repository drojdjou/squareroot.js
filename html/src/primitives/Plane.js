/**
 *  @method createPlane
 *  @memberof SQR.Primitives
 *
 *  @description Creates a plane, by default on the X/Y plane
 *
 *  @param {Number} w - width of the plane
 *  @param {Number} h - height of the plane
 *  @param {Number} wd - number of segments along the width
 *  @param {Number} hd - number of segments along the height
 *  @param {Number} wo - horizontal offset
 *  @param {Number} ho - vertical offset
 *
 *	@param {Object} options - options for the plan construction
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.createPlane = function(w, h, wd, hd, wo, ho, options) {

	var options = options || {};

	var w = w * 0.5;
	var h = h * 0.5;

	var wo = wo || 0;
	var ho = ho || 0;

	var wd = wd || 1;
	var hd = hd || 1;

	var wStart = -w + wo;
	var hStart = -h + ho;

	var wb = (w * 2) / wd;
	var hb = (h * 2) / hd;

	var i, j;
	var m = new SQR.Mesh();

	for (i = 0; i < wd+1; i++) {
		for (j = 0; j < hd+1; j++) {

			var bvStart = wStart + i * wb;
			var bhStart = hStart + j * hb;

			if (!options.zUp) {
				m.V(bvStart, 0, bhStart);
			} else {
				m.V(bvStart, bhStart, 0);
			}

			m.T(i/wd, j/hd);
		}
	}

	for (i = 0; i < wd; i++) {
		for (j = 0; j < hd; j++) {

			var bvStart = wStart + i * wb;
			var bvEnd = bvStart + wb;
			var bhStart = hStart + j * hb;
			var bhEnd = bhStart + hb;

			var a = (i+0) * (hd+1) + j;
			var b = (i+1) * (hd+1) + j;

			m.F(a, a+1, b, b+1).T(a, a+1, b, b+1);
		}
	}

	m.calculateNormals(options.smooth);
	if(options.flip) m.flip();

	return m.update();
}


 /*
 *  @method create2DQuad
 *  @memberof SQR.Primitives
 *
 *  @description Creates a 2d quad
 *
 *  @param {Number} x - x position of the quad
 *  @param {Number} y - y position of the quad
 *  @param {Number} w - width of the quad
 *  @param {Number} h - height of the quad
 *
 *  @returns {SQR.Buffer}
 */
// SQR.Primitives.create2DQuad = function(x, y, w, h) {
// 	return SQR.Buffer()
// 		.layout(SQR.v2u2(), 6)
// 		.data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
// 		.data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
// 		.update();
// }















