SQR.Primitives.create2DQuad = function(x, y, w, h) {

	return SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
        .data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
        .update();
}

SQR.Primitives.createPlane = function(w, h, wd, hd, wo, ho) {

    var faces = [], vCols = [], uvCols = [];

    var geo = new SQR.Buffer();
    var options = options || {};
    
    geo.width = w;
    geo.height = h;

    var w = w * 0.5;
    var h = h * 0.5;

    var wo = wo || 0;
    var ho = ho || 0;

    var wd = wd || 1;
    var hd = hd || 1;

    faces.length = [];

    var wStart = -w + wo;
    var hStart = -h + ho;

    var wb = geo.width / wd;
    var hb = geo.height / hd;

    var i, j;

    for (i = 0; i < wd+1; i++) {
        vCols[i] = [];
        uvCols[i] = [];

        for (j = 0; j < hd+1; j++) {
            var bvStart = wStart + i * wb;
            var bhStart = hStart + j * hb;

            uvCols[i][j] = new SQR.V2(i/wd, j/hd);

            if (!options.zUp) {
                vCols[i][j] = new SQR.V3(bvStart, 0, bhStart);
            } else {
                vCols[i][j] = new SQR.V3(bvStart, bhStart, 0);
            }
        }
    }

    for (i = 0; i < wd; i++) {
        for (j = 0; j < hd; j++) {

            var bvStart = wStart + i * wb;
            var bvEnd = bvStart + wb;
            var bhStart = hStart + j * hb;
            var bhEnd = bhStart + hb;

            var va = vCols[i][j], vb = vCols[i][j+1], vc = vCols[i+1][j], vd = vCols[i+1][j+1];
            var uva = uvCols[i][j], uvb = uvCols[i][j+1], uvc = uvCols[i+1][j], uvd = uvCols[i+1][j+1];

            var q = new SQR.Face().setPosition(va, vb, vc, vd).setUV(uva, uvb, uvc, uvd);
            faces.push(q);
        }
    }

    geo.layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, wd * hd * 6);

    var c = 0, t;
	faces.forEach(function(t) {
		c += t.calculateNormal().toBuffer(geo, c);
	});

    return geo;
}