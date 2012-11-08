SQR.Plane = function(w, h, wd, hd, wo, ho, yup) {
    this.triangles = [];

    wo = wo || 0;
    ho = ho || 0;

    wd = wd || 1;
    hd = hd || 1;

    w = w * 0.5;
    h = h * 0.5;

    var wStart = -w + wo;
    var hStart = -h + ho;

    var wb = (w * 2) / wd;
    var hb = (h * 2) / hd;

    var i, j;

    for (i = 0; i < wd; i++) {
        for (j = 0; j < hd; j++) {

            var bvStart = wStart + i * wb;
            var bvEnd = bvStart + wb;
            var bhStart = hStart + j * hb;
            var bhEnd = bhStart + hb;

            var va, vb, vc, vd;

            if (yup) {
                va = new SQR.V3(bvStart, 0, bhStart);
                vb = new SQR.V3(bvEnd, 0, bhStart);
                vc = new SQR.V3(bvEnd, 0, bhEnd);
                vd = new SQR.V3(bvStart, 0, bhEnd);
            } else {
                va = new SQR.V3(bvStart, bhStart, 0);
                vb = new SQR.V3(bvEnd, bhStart, 0);
                vc = new SQR.V3(bvEnd, bhEnd, 0);
                vd = new SQR.V3(bvStart, bhEnd, 0);

            }

            var color = SQR.Color.hsl(0, 0, 30 + 30 * Math.random());
            this.triangles.push(new SQR.Triangle(va, vb, vc, color));

            //var color = SQR.Color.hsl(0, 0, 30 + 30 * Math.random());
            this.triangles.push(new SQR.Triangle(va, vc, vd, color));
        }
    }

    this.applyHeightMap = function(heightMap, maxHeight, offset) {

        var numTriangles = this.triangles.length;

        var minrow = 0, mincol = 0;
        var maxrow = 0, maxcol = 0;
        var ol = Math.floor(offset);
        var oh = Math.ceil(offset);
        var od = offset - Math.floor(offset);

        var processTri = function(t) {
            //var row = Math.round((t.x / w + 1) / 2 * wd);
            //var col = Math.round((t.z / h + 1) / 2 * hd);

            var row = (t.x / w + 1) / 2;
            var col = (t.z / h + 1) / 2;

            var hl = SQR.CanvasUtil.getPixelNormRed(heightMap, col, row) / 255 * maxHeight;
            var hh = SQR.CanvasUtil.getPixelNormRed(heightMap, col, row) / 255 * maxHeight;

            var he = hl;
            if (od > 0) {
                he += (hh - hl) * od;
            }

            t.y = maxHeight - he;
        }

        for (var i = 0; i < numTriangles; i++) {
            var t = this.triangles[i];
            processTri(t.a);
            processTri(t.b);
            processTri(t.c);
        }
    }
}