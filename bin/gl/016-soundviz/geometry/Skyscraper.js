SQR.Skyscraper = function() {

    var that = this;
    var numTris = 12;

    this.vertexSize = 3;
    this.numVertices = numTris * this.vertexSize;

    var perVertextNormals = false;

    this.perVertexNormals = function(v) {
        perVertextNormals = v;
        return that;
    }

    this.corners = {};

    var ts = [], vs = [], ns = [], tcs = [];

    this.setSize = function(w, h, d, ofx, ofy, ofz) {
        ts.length = 0;

        var of = new SQR.V3(ofx || 0, ofy || 0, ofz || 0);

        var ftl = new SQR.V3(w * -0.5,   h * 0.5,    d * 0.5).appendVec(of);
        var ftr = new SQR.V3(w * 0.5,    h * 0.5,    d * 0.5).appendVec(of);
        var fbl = new SQR.V3(w * -0.5,   h * -0.5,   d * 0.5).appendVec(of);
        var fbr = new SQR.V3(w * 0.5,    h * -0.5,   d * 0.5).appendVec(of);

        var btl = new SQR.V3(w * -0.5,   h * 0.5,    d * -0.5).appendVec(of);
        var btr = new SQR.V3(w * 0.5,    h * 0.5,    d * -0.5).appendVec(of);
        var bbl = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5).appendVec(of);
        var bbr = new SQR.V3(w * 0.5,    h * -0.5,   d * -0.5).appendVec(of);

        that.corners.ftl = ftl;
        that.corners.ftr = ftr;
        that.corners.fbl = fbl;
        that.corners.fbr = fbr;

        that.corners.btl = btl;
        that.corners.btr = btr;
        that.corners.bbl = bbl;
        that.corners.bbr = bbr;

        var uvtl = new SQR.V2(0, 0);
        var uvtr = new SQR.V2(1, 0);
        var uvbl = new SQR.V2(0, 1);
        var uvbr = new SQR.V2(1, 1);

        ts.push(new SQR.Triangle(ftl, ftr, fbr).setUV(uvbl, uvbr, uvtr));
        ts.push(new SQR.Triangle(ftl, fbr, fbl).setUV(uvbl, uvtr, uvtl));

        ts.push(new SQR.Triangle(btl, bbr, btr).setUV(uvbr, uvtl, uvbl));
        ts.push(new SQR.Triangle(btl, bbl, bbr).setUV(uvbr, uvtr, uvtl));

        ts.push(new SQR.Triangle(ftl, fbl, btl).setUV(uvbr, uvtr, uvbl));
        ts.push(new SQR.Triangle(fbl, bbl, btl).setUV(uvtr, uvtl, uvbl));

        ts.push(new SQR.Triangle(ftr, btr, fbr).setUV(uvbl, uvbr, uvtl));
        ts.push(new SQR.Triangle(fbr, btr, bbr).setUV(uvtl, uvbr, uvtr));

        ts.push(new SQR.Triangle(ftl, btl, ftr).setUV(uvtl, uvbl, uvtr));
        ts.push(new SQR.Triangle(btl, btr, ftr).setUV(uvbl, uvbr, uvtr));

        ts.push(new SQR.Triangle(fbl, fbr, bbl).setUV(uvbl, uvbr, uvtl));
        ts.push(new SQR.Triangle(bbl, fbr, bbr).setUV(uvtl, uvbr, uvtr));

        that.refresh();

        return that;
    }

    this.refresh = function() {
        vs.length = 0;
        ns.length = 0;
        tcs.length = 0;

        for(var i = 0; i < numTris; i++) {
            ts[i].calculateNormal(perVertextNormals);
        }

        for(var i = 0; i < numTris; i++) {
            ts[i].toArray(vs, ns, tcs);
        }

        that.vertices = new Float32Array(vs);
        that.normals = new Float32Array(ns);
        that.textureCoord = new Float32Array(tcs);
        
        that.dirty = true;
        return that;
    }        
}