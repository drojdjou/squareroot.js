SQR.Cube = function() {

    var that = this;
    var numTris = 12;

    this.vertexSize = 3;
    this.numVertices = numTris * this.vertexSize;

    this.corners = {};

    var ts = [], vs = [], ns = [];

    this.setSize = function(w, h, d) {
        ts.length = 0;

        var ftl = new SQR.V3(w * -0.5,   h * 0.5,    d * 0.5);
        var ftr = new SQR.V3(w * 0.5,    h * 0.5,    d * 0.5);
        var fbl = new SQR.V3(w * -0.5,   h * -0.5,   d * 0.5);
        var fbr = new SQR.V3(w * 0.5,    h * -0.5,   d * 0.5);

        var btl = new SQR.V3(w * -0.5,   h * 0.5,    d * -0.5);
        var btr = new SQR.V3(w * 0.5,    h * 0.5,    d * -0.5);
        var bbl = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5);
        var bbr = new SQR.V3(w * 0.5,    h * -0.5,   d * -0.5);

        that.corners.ftl = ftl;
        that.corners.ftr = ftr;
        that.corners.fbl = fbl;
        that.corners.fbr = fbr;

        that.corners.btl = btl;
        that.corners.btr = btr;
        that.corners.bbl = bbl;
        that.corners.bbr = bbr;
    
        ts.push(new SQR.Triangle(ftl, ftr, fbr));
        ts.push(new SQR.Triangle(ftl, fbr, fbl));

        ts.push(new SQR.Triangle(btl, bbr, btr));
        ts.push(new SQR.Triangle(btl, bbl, bbr));

        ts.push(new SQR.Triangle(ftl, fbl, btl));
        ts.push(new SQR.Triangle(fbl, bbl, btl));

        ts.push(new SQR.Triangle(ftr, btr, fbr));
        ts.push(new SQR.Triangle(fbr, btr, bbr));

        ts.push(new SQR.Triangle(ftl, btl, ftr));
        ts.push(new SQR.Triangle(btl, btr, ftr));

        ts.push(new SQR.Triangle(fbl, fbr, bbl));
        ts.push(new SQR.Triangle(bbl, fbr, bbr));

        that.refresh();

        return that;
    }

    this.refresh = function() {
        vs.length = 0;
        ns.length = 0;

        for(var i = 0; i < numTris; i++) {
            ts[i].calculateNormal();
            ts[i].toArray(vs, ns);
        }

        that.vertices = new Float32Array(vs);
        that.normals = new Float32Array(ns);
        
        that.dirty = true;
        return that;
    }        
}