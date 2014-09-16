/**
 *  Creates a cube geometry.
 *  @returns geometry {SQR.Geometry}
 */
SQR.Sphere = function(radius, segmentsWidth, segmentsHeight) {
    var that = this;
    SQR.GeometryNew.call(this);

    var vertices = [];
    var uvs = [];

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

    var radius = radius || 50;
    var segmentsX = Math.max(3, Math.floor(segmentsWidth) || 8);
    var segmentsY = Math.max(3, Math.floor(segmentsHeight) || 6);

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



            var xp = -1 * Math.cos(u*PI*2) * Math.sin(v*PI);
            var yp = Math.cos(v*PI);
            var zp = Math.sin(u*PI*2) * Math.sin(v*PI);

            

            

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

            // var n1 = vt1.cp().norm();
            // var n2 = vt2.cp().norm();
            // var n3 = vt3.cp().norm();
            // var n4 = vt4.cp().norm();

            // var p = Math.floor(c.vertices.length / 3);

            addFace(vt1, vt2, vt3, uv1, uv2, uv3);
            addFace(vt1, vt3, vt4, uv1, uv3, uv4);

            // c.vertices.push(vt1.x, vt1.y, vt1.z, vt2.x, vt2.y, vt2.z, vt3.x, vt3.y, vt3.z, vt4.x, vt4.y, vt4.z);
            // c.uv1.push(uv1[0], uv1[1], uv2[0], uv2[1], uv3[0], uv3[1], uv4[0], uv4[1]);
            // c.normals.push(n1.x, n1.y, n1.z, n2.x, n2.y, n2.z, n3.x, n3.y, n3.z, n4.x, n4.y, n4.z);
            // c.tris.push(p + 0, p + 1, p + 2, p + 0, p + 2, p + 3);
        }
    }
}

SQR.Cube.prototype = new SQR.GeometryNew();
SQR.Cube.prototype.constructor = SQR.GeometryNew; 
