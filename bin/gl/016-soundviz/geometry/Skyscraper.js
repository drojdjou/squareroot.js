SQR.Skyscraper = function() {

    options = options || {};
    options.offset = options.offset || new SQR.V3();

    var faces = [], vertices = [], normals = [], texcoords = [];
    var geo = new SQR.Geometry().quickSetup('v3n3t2');
    var options;
    
    geo.create = function(w, h, d, ofx, ofy, ofz) {
        faces.length = 0;

        var of = new SQR.V3(ofx || 0, ofy || 0, ofz || 0);

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

        faces.push(new SQR.Triangle(ftl, ftr, fbr).setUV(uvbl, uvbr, uvtr));
        faces.push(new SQR.Triangle(ftl, fbr, fbl).setUV(uvbl, uvtr, uvtl));

        faces.push(new SQR.Triangle(btl, bbr, btr).setUV(uvbr, uvtl, uvbl));
        faces.push(new SQR.Triangle(btl, bbl, bbr).setUV(uvbr, uvtr, uvtl));

        faces.push(new SQR.Triangle(ftl, fbl, btl).setUV(uvbr, uvtr, uvbl));
        faces.push(new SQR.Triangle(fbl, bbl, btl).setUV(uvtr, uvtl, uvbl));

        faces.push(new SQR.Triangle(ftr, btr, fbr).setUV(uvbl, uvbr, uvtl));
        faces.push(new SQR.Triangle(fbr, btr, bbr).setUV(uvtl, uvbr, uvtr));

        faces.push(new SQR.Triangle(ftl, btl, ftr).setUV(uvtl, uvbl, uvtr));
        faces.push(new SQR.Triangle(btl, btr, ftr).setUV(uvbl, uvbr, uvtr));

        faces.push(new SQR.Triangle(fbl, fbr, bbl).setUV(uvbl, uvbr, uvtl));
        faces.push(new SQR.Triangle(bbl, fbr, bbr).setUV(uvtl, uvbr, uvtr));

        geo.refresh();

        return geo;
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
            faces[i].toArray(vertices, normals, texcoords);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        geo.data(SQR.Geometry.TEXCOORD, texcoords);

        return geo;
    }    

    return geo;    
}