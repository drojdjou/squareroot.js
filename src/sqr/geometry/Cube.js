SQR.Cube = function(options) {

    options = options || {};
    options.offset = options.offset || new SQR.V3();

    var faces = [], vertices = [], normals = [], texcoords = [];
    var geo = new SQR.Geometry().quickSetup('v3n3t2');
    var options;

    geo.corners = {};

    var addFace = function(v1, v2, v3, t1, t2, t3) {
        var f = new SQR.Triangle(options);

        if(options.skybox) f.setVertices(v1, v3, v2);
        else f.setVertices(v1, v2, v3);
        
        f.setAttribute(SQR.Geometry.TEXCOORD, t1, t2, t3);
        faces.push(f);
    }

    geo.create = function(w, h, d) {
        h = h || w;
        d = d || w;
        
        var of = options.offset;

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

        geo.corners.ftl = ftl;
        geo.corners.ftr = ftr;
        geo.corners.fbl = fbl;
        geo.corners.fbr = fbr;

        geo.corners.btl = btl;
        geo.corners.btr = btr;
        geo.corners.bbl = bbl;
        geo.corners.bbr = bbr;

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

        return geo.refresh();
    }

    geo.refresh = function() {
        var numTris = faces.length;

        vertices.length = 0;
        normals.length = 0;
        texcoords.length = 0;

        for(var i = 0; i < numTris; i++) {
            faces[i].calculateNormal();
        }

        for(var i = 0; i < numTris; i++) {
            faces[i].toArray(SQR.Geometry.VERTEX, vertices);
            faces[i].toArray(SQR.Geometry.NORMAL, normals);
            faces[i].toArray(SQR.Geometry.TEXCOORD, texcoords);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        geo.data(SQR.Geometry.TEXCOORD, texcoords);
        
        return geo;
    }  

    return geo;
}
