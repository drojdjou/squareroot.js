/**
 *  Creates a cube geometry.
 *  @returns geometry {SQR.Geometry}
 */
SQR.Cube = function(w, h, d) {
    var that = this;
    SQR.GeometryNew.call(this);

    var of = new SQR.V3();
    this.corners = {};

    var addFace = function(v1, v2, v3, t1, t2, t3) {

        var vt1 = new SQR.Vertex()
        vt1.add(SQR.Vertex.POSITION, v1.clone());
        // vt1.add(SQR.Vertex.TEXCOORD, t1);

        var vt2 = new SQR.Vertex()
        vt2.add(SQR.Vertex.POSITION, v2.clone());
        // vt2.add(SQR.Vertex.TEXCOORD, t2);

        var vt3 = new SQR.Vertex()
        vt3.add(SQR.Vertex.POSITION, v3.clone());
        // vt3.add(SQR.Vertex.TEXCOORD, t3);

        that.vertices.push(vt1, vt2, vt3);
        var l = that.vertices.length;
        var t = new SQR.TriangleNew(that.vertices, l-3, l-2, l-1);
        that.faces.push(t);
    }

    var ftl = new SQR.V3(w * -0.5,   h * 0.5,    d * 0.5).appendVec(of);
    var ftr = new SQR.V3(w * 0.5,    h * 0.5,    d * 0.5).appendVec(of);
    var fbl = new SQR.V3(w * -0.5,   h * -0.5,   d * 0.5).appendVec(of);
    var fbr = new SQR.V3(w * 0.5,    h * -0.5,   d * 0.5).appendVec(of);

    var btl = new SQR.V3(w * -0.5,   h * 0.5,    d * -0.5).appendVec(of);
    var btr = new SQR.V3(w * 0.5,    h * 0.5,    d * -0.5).appendVec(of);
    var bbl = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5).appendVec(of);
    var bbr = new SQR.V3(w * 0.5,    h * -0.5,   d * -0.5).appendVec(of);

    var uvtl = new SQR.V2(0, 0);
    var uvtr = new SQR.V2(1, 0);
    var uvbl = new SQR.V2(0, 1);
    var uvbr = new SQR.V2(1, 1);

    this.corners.ftl = ftl;
    this.corners.ftr = ftr;
    this.corners.fbl = fbl;
    this.corners.fbr = fbr;

    this.corners.btl = btl;
    this.corners.btr = btr;
    this.corners.bbl = bbl;
    this.corners.bbr = bbr;

    addFace(ftl, ftr, fbr, uvbl, uvbr, uvtr);
    addFace(ftl, fbr, fbl, uvbl, uvtr, uvtl);

    addFace(btl, bbr, btr, uvbr, uvtl, uvbl);
    addFace(btl, bbl, bbr, uvbr, uvtr, uvtl);

    addFace(ftl, fbl, btl, uvbr, uvtr, uvbl);
    addFace(fbl, bbl, btl, uvtr, uvtl, uvbl);

    addFace(ftr, btr, fbr, uvbl, uvbr, uvtl);
    addFace(fbr, btr, bbr, uvtl, uvbr, uvtr);

    addFace(ftl, btl, ftr, uvtl, uvbl, uvtr);
    addFace(btl, btr, ftr, uvbl, uvbr, uvtr);

    addFace(fbl, fbr, bbl, uvbl, uvbr, uvtl);
    addFace(bbl, fbr, bbr, uvtl, uvbr, uvtr);
}

SQR.Cube.prototype = new SQR.GeometryNew();
SQR.Cube.prototype.constructor = SQR.GeometryNew; 
