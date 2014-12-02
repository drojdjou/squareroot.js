SQR.Primitives.createSphere = function(radius, sw, sh, options) {

    var vertices = [];
    var uvs = [];
    var faces = [];

    options = options || {};

    var radius = radius || 50;
    var segmentsX = Math.max(3, Math.floor(sw) || 8);
    var segmentsY = Math.max(3, Math.floor(sh) || 6);

    var phiStart = 0;
    var phiLength = Math.PI * 2;

    var thetaStart = 0;
    var thetaLength = Math.PI;

    var x, y;

    for (y = 0; y <= segmentsY; y ++) {

        for (x = 0; x <= segmentsX; x ++) {

            var u = x / segmentsX;
            var v = y / segmentsY;

            var xp = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
            var yp = radius * Math.cos(thetaStart + v * thetaLength);
            var zp = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

            vertices.push(new SQR.V3(xp, yp, zp));
            uvs.push(new SQR.V2(u, 1 - v));
        }
    }

    for (y = 0; y < segmentsY; y ++) {

        for (x = 0; x < segmentsX; x ++) {

            var o = segmentsX + 1;
            var vt1 = vertices[ y * o + x + 0 ];
            var vt2 = vertices[ y * o + x + 1 ];
            var vt3 = vertices[ (y + 1) * o + x + 1 ];
            var vt4 = vertices[ (y + 1) * o + x + 0 ];

            var uv1 = uvs[ y * o + x + 0 ];
            var uv2 = uvs[ y * o + x + 1 ];
            var uv3 = uvs[ (y + 1) * o + x + 1 ];
            var uv4 = uvs[ (y + 1) * o + x + 0 ];

            var f;

            if(options.reverseNormals)
                f = new SQR.Face().setPosition(vt2, vt1, vt3, vt4).setUV(uv2, uv1, uv3, uv4);
            else 
                f = new SQR.Face().setPosition(vt1, vt2, vt4, vt3).setUV(uv1, uv2, uv4, uv3);

            if(options.flatShading) {
                f.calculateNormal();
            } else {
                vt1.normal = vt1.clone().norm();
                vt2.normal = vt2.clone().norm();
                vt3.normal = vt3.clone().norm();
                vt4.normal = vt4.clone().norm();

                if(options.reverseNormals) {
                    vt1.normal.neg();
                    vt2.normal.neg();
                    vt3.normal.neg();
                    vt4.normal.neg();
                }
            }

            faces.push(f);
        }
    }

    var geo = SQR.Buffer()
        .layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, faces.length * 6);

    var c = 0, t;
    faces.forEach(function(t) {
        c += t.toBuffer(geo, c, !options.flatShading);
    });

    return geo;
}










