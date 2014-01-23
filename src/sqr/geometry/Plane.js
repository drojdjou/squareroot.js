/*

w = width
h = height
wd = segmetns height
wh = segments width
wo = width offset
wh = height offset 
yup = if true object is on xz plane, if flase - on xy, defaults to false

*/
SQR.Plane = function(w, h, wd, hd, wo, ho, yup) {
    
    var that = this;

    wo = wo || 0;
    ho = ho || 0;

    wd = wd || 1;
    hd = hd || 1;

    this.width = w;
    this.height = h;

    w = w * 0.5;
    h = h * 0.5;

    this.refresh = function() {
        this.polygons = [];

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

                // a  b
                // d  c

                var t1 = new SQR.Triangle(va, vb, vc);
                var t2 = new SQR.Triangle(va, vc, vd);

                this.polygons.push(t1);
                this.polygons.push(t2);
            }
        }
    }

    this.refresh();
}