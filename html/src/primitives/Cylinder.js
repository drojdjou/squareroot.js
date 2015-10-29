/**
 *  @method createCylinder
 *  @memberof SQR.Primitives
 *
 *  @description Creates a cylinder with UVs, non-indexed
 *
 *  @param {Number} height - height of the cylinder
 *  @param {Number} radius - radius of the cylinder
 *  @param {Number} segments - number of segments along the cylinder
 *  @param {Object} options - additional options
 *
 *  @todo document the options
 *
 *  @returns {SQR.Buffer}
 */
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

        options.heightSegments = options.heightSegments || options.hs || 0;

        if(!options.heightSegments) {

            addFace(t0, b0, t1, b1, t0uv, b0uv, t1uv, b1uv);           

            if(options.noCaps && options.insideFaces) {
                addFace(t0._inside, t1._inside, b0._inside, b1._inside, t0uv, b0uv, t1uv, b1uv);
            }
        } else {
            var t0b0 = new SQR.V3().sub(b0, t0);
            var t1b1 = new SQR.V3().sub(b1, t1);

            var t0l = new SQR.V3().copyFrom(t0);
            var t1l = new SQR.V3().copyFrom(t1);

            var t0c = new SQR.V3();
            var t1c = new SQR.V3();

            var n = options.heightSegments;

            for(var hs = 0; hs < n + 1; hs++) {
                t0c.copyFrom(t0b0).mul(1/n * hs).add(t0, t0c);
                t1c.copyFrom(t1b1).mul(1/n * hs).add(t1, t1c);

                addFace(t0l.clone(), t0c.clone(), t1l.clone(), t1c.clone(), t0uv, b0uv, t1uv, b1uv);  

                t0l.copyFrom(t0c);
                t1l.copyFrom(t1c);
            }
        }

        if(!options.noCaps) {
            addFace(t0, t1, topMiddle, null, b0uv, b1uv, t1uv);
            addFace(b1, b0, bottomMiddle, null, b1uv, b0uv, t1uv);
        }         
    }

    var l = options.layout || {'aPosition': 3, 'aNormal': 3, 'aUV': 2 };

    var geo = SQR.Buffer()
        .layout( l, faces.length * 6);

    var c = 0, t;
    faces.forEach(function(t) {
        c += t.calculateNormal().toBuffer(geo, c);
    });

    return geo;
    
}