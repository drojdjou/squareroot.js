/*

w = width
h = height
wd = segmetns height
wh = segments width
wo = width offset
wh = height offset 
yup = if true object is on xz plane, if flase - on xy, defaults to false

*/
SQR.Plane = function(options) {
    
    var that = this;
    var w, h, wd, hd, wo, ho;
    var ts = [], vs = [], ns = [], tcs = [];

    options = options || {};
    
    this.faces = [];
    this.vertexSize = 3;
    this.vectors = [];

    this.setSize = function(_w, _h, _wd, _hd, _wo, _ho) {
        this.width = _w;
        this.height = _h;

        w = _w * 0.5;
        h = _h * 0.5;

        wo = _wo || 0;
        ho = _ho || 0;

        wd = _wd || 1;
        hd = _hd || 1;

        that.faces.length = [];

        var wStart = -w + wo;
        var hStart = -h + ho;

        var wb = _w / wd;
        var hb = _h / hd;

        var i, j;

        var vCols = [], uvCols = [];

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

                that.vectors.push(vCols[i][j]);
            }
        }

        for (i = 0; i < wd; i++) {
            for (j = 0; j < hd; j++) {

                var bvStart = wStart + i * wb;
                var bvEnd = bvStart + wb;
                var bhStart = hStart + j * hb;
                var bhEnd = bhStart + hb;

                var va = vCols[i][j], vb = vCols[i+1][j], vc = vCols[i+1][j+1], vd = vCols[i][j+1];
                var uva = uvCols[i][j], uvb = uvCols[i+1][j], uvc = uvCols[i+1][j+1], uvd = uvCols[i][j+1];

                if(options.quads) {
                    var q = new SQR.Quad(va, vb, vc, vd).setUV(uva, uvb, uvc, uvd);
                    this.faces.push(q);
                } else {
                    var t1 = new SQR.Triangle(va, vb, vc).setUV(uva, uvb, uvc);
                    var t2 = new SQR.Triangle(va, vc, vd).setUV(uva, uvc, uvd);
                    this.faces.push(t1, t2);
                }
            }
        }

        numFaces = this.faces.length;

        this.numVertices = numFaces * this.vertexSize;
        if(options.quads) this.numVertices *= 2;

        that.refresh();

        return that;
    }


    this.refresh = function() {

        vs.length = 0;
        ns.length = 0;
        tcs.length = 0;

        for(var i = 0; i < numFaces; i++) {
            this.faces[i].calculateNormal(options.vertexNormals);
        }

        for(var i = 0; i < numFaces; i++) {
            this.faces[i].toArray(vs, ns, tcs);
        }

        that.vertices = new Float32Array(vs);
        that.normals = new Float32Array(ns);
        that.textureCoord = new Float32Array(tcs);

        that.dirty = true;
        return that;   
    }
}



















