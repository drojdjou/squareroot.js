SQR.Cylinder = function(options) {

    options = options || {};

    var topVectors, bottomVectors, topUV, bottomUV;
    var topMiddle, bottomMiddle;

    var faces = [], vertices = [], normals = [], texcoords = [];
    var geo = new SQR.Geometry().quickSetup('v3n3t2');

    var addFace = function(v1, v2, v3, t1, t2, t3) {
        var f = new SQR.Triangle(options);
        f.setVertices(v1, v2, v3);
        f.setAttribute(SQR.Geometry.TEXCOORD, t1, t2, t3);
        faces.push(f);
    }

    geo.create = function(height, radius, segments) {

        topVectors = [];
        bottomVectors = [];
        topUV = [];
        bottomUV = [];

        for(var i = 0; i < segments; i++) {

            var t = new SQR.V3(), b = new SQR.V3();
            var tuv = new SQR.V2(), buv = new SQR.V2();

            var cos = Math.cos(i / segments * SQR.twoPI) * radius;
            var sin = Math.sin(i / segments * SQR.twoPI) * radius;

            if(options.vertical) {
                t.set(sin, height * -0.5, cos);
                b.set(sin, height *  0.5, cos);
            } else {
                t.set(height * -0.5, cos, sin);
                b.set(height *  0.5, cos, sin);
            }

            tuv.set(i/segments, 0);
            buv.set(i/segments, 1);

            if(!options.noCaps) {
                if(options.vertical) {
                    topMiddle = new SQR.V3(0, height * -0.5, 0);
                    bottomMiddle = new SQR.V3(0, height *  0.5, 0);
                } else {
                    topMiddle = new SQR.V3(height * -0.5, 0, 0);
                    bottomMiddle = new SQR.V3(height *  0.5, 0, 0);
                }
            }
    
            topVectors.push(t);
            bottomVectors.push(b);

            topUV.push(tuv);
            bottomUV.push(buv);

            if(options.insideFaces) {
                t._inside = t.clone();
                b._inside = b.clone();
            }
        }

        for(var i = 0; i < segments; i++) {
            
            var t0 = topVectors[i];
            var b0 = bottomVectors[i];
            var t0uv = topUV[i];
            var b0uv = bottomUV[i];

            var n = (i + 1) % segments;

            var t1 = topVectors[n];
            var b1 = bottomVectors[n];
            var t1uv = topUV[n];
            var b1uv = bottomUV[n];

            addFace(t0, b0, t1, t0uv, b0uv, t1uv);           
            addFace(t1, b0, b1, t1uv, b0uv, b1uv);  

            if(options.noCaps) {
                if(options.insideFaces) {
                    addFace(t0._inside, t1._inside, b0._inside, t0uv, b0uv, t1uv);           
                    addFace(t1._inside, b1._inside, b0._inside, t1uv, b0uv, b1uv);  
                }
            } else {
                addFace(t0, t1, topMiddle, t0uv, b0uv, t1uv);
                addFace(b1, b0, bottomMiddle, t1uv, b0uv, b1uv);
            }         
        }

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
