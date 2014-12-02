SQR.Primitives.createCylinder = function(height, radius, segments, options) {

    options = options || {};

    var topVectors, bottomVectors, topUV, bottomUV;
    var topMiddle, bottomMiddle;

    var faces = [], vertices = [], normals = [], texcoords = [];

    var addFace = function(v1, v2, v3, v4, t1, t2, t3, t4) {
        var f = new SQR.Face().setPosition(v1, v2, v3, v4).setUV(t1, t2, t3, t4);
        faces.push(f);
    }

    topVectors = [];
    bottomVectors = [];
    topUV = [];
    bottomUV = [];

    for(var i = 0; i < segments; i++) {

        var t = new SQR.V3(), b = new SQR.V3();
        var tuv = new SQR.V2(), buv = new SQR.V2();

        var cos = Math.cos(i / segments * SQR.TWOPI) * radius;
        var sin = Math.sin(i / segments * SQR.TWOPI) * radius;

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

        addFace(t0, b0, t1, b1, t0uv, b0uv, t1uv, b1uv);           

        if(options.noCaps) {
            if(options.insideFaces) {
                addFace(t0._inside, t1._inside, b0._inside, b1._inside, t0uv, b0uv, t1uv, b1uv);           
            }
        } else {
            addFace(t0, t1, topMiddle, null, b0uv, b1uv, t1uv);
            addFace(b1, b0, bottomMiddle, null, b1uv, b0uv, t1uv);
        }         
    }

    var geo = SQR.Buffer()
        .layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, faces.length * 6);

    var c = 0, t;
    faces.forEach(function(t) {
        c += t.calculateNormal().toBuffer(geo, c);
    });

    return geo;
    
}