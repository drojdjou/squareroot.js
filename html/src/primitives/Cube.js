/**
 *  @method createCube
 *  @memberof SQR.Primitives
 *
 *  @description Creates a simple cube geometry, 1 quad per side, non-indexed
 *	@returns {SQR.Buffer}
 */
SQR.Primitives.createCube = function(w, h, d) {

	w = w || 1;
	h = h || 1;
	d = d || 1;

	var geo = SQR.Buffer()
		.layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, 36);
	
	var v0 = new SQR.V3(w * -0.5,   h *  0.5,   d *  0.5); // Top left
	var v1 = new SQR.V3(w *  0.5,   h *  0.5,   d *  0.5); // Top right 
	var v2 = new SQR.V3(w * -0.5,   h * -0.5,   d *  0.5); // Bottom left 
	var v3 = new SQR.V3(w *  0.5,   h * -0.5,   d *  0.5); // Bottom right

	var v4 = new SQR.V3(w * -0.5,   h *  0.5,   d * -0.5); // Top left
	var v5 = new SQR.V3(w *  0.5,   h *  0.5,   d * -0.5); // Top right
	var v6 = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5); // Bottom left
	var v7 = new SQR.V3(w *  0.5,   h * -0.5,   d * -0.5); // Bottom right

	var u0 = new SQR.V2(0, 1);
	var u1 = new SQR.V2(1, 1);
	var u2 = new SQR.V2(0, 0);
	var u3 = new SQR.V2(1, 0);

	var faces = [];

	faces.push(SQR.Face().setPosition(v0, v1, v2, v3).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v5, v4, v7, v6).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v0, v6, v2).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v1, v5, v3, v7).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v5, v0, v1).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v2, v3, v6, v7).setUV(u0, u1, u2, u3));
	
	var c = 0, t;
	faces.forEach(function(t) {
		c += t.calculateNormal().toBuffer(geo, c);
	});

	// SQR.Debug.traceBuffer(geo, true);
	
	return geo;
}