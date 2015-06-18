SQR.Primitives.createIcosphere = function(radius, subdivisions, options) {

    var faces = [], vectors = [];
    var vertices = [], normals = [], colors = [], texcoords = [];
    var cache = [], cacheIndex = 0;

    options = options || {};

    var levels = [
        [1, 0, 0, 1],
        [0, 1, 0, 2],
        [0, 0, 1, 3],
        [1, 1, 0, 4],
        [0, 1, 1, 5]
    ];

    var addVertex = function(v) {
        vectors.push(v);
    }

    var texTmp = new SQR.V3();
    var up = new SQR.V3(0, 1, 0);
    var forward = new SQR.V3(0, 0, 1);

    var getTexCoord = function(v) {
        var tx, ty;
        texTmp.copyFrom(v);
        texTmp.norm();
        tx = 1.0 - (0.5 + Math.atan2(texTmp.z, texTmp.x) / SQR.TWOPI);
        ty = 1.0 - (0.5 - Math.asin(texTmp.y) / Math.PI);
        return new SQR.V2(tx, ty);
    }

    var addFace = function(a, b, c, ca, cb, cc) {
        var ta = getTexCoord(a);
        var tb = getTexCoord(b);
        var tc = getTexCoord(c);
        var f = new SQR.Face().setPosition(a, b, c).setUV(ta, tb, tc).setColor(ca, cb, cc);
        faces.push(f);
    }

    // > http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html

    var checkSubdivisionCache = function(v1, v2) {
        var l = vectors.length;

        for(var i = 0; i < l; i++) {
            var vc = vectors[i];

            var lr = vc.__v1 == v1 && vc.__v2 == v2;
            var rl = vc.__v2 == v1 && vc.__v1 == v2;

            if(lr || rl) return vc;
        }

        var v = new SQR.V3();
        v.sub(v1, v2).mul(0.5).add(v, v2).norm().mul(radius);

        v.__v1 = v1;
        v.__v2 = v2;
        vectors.push(v);

        v.normal = v.clone();

        return v;
    }

    var subdivide = function() {

        // console.log("--- subdivide");

        cache[cacheIndex] = {};
        var c = cache[cacheIndex];

        c.faces = faces;
        c.vectors = vectors;
        faces = [];
        // vectors = [];

        var numTris = c.faces.length;

        for(var i = 0; i < numTris; i++) {
            var vs = c.faces[i];

            var ab = checkSubdivisionCache(vs.a, vs.b);
            var ac = checkSubdivisionCache(vs.a, vs.c);
            var bc = checkSubdivisionCache(vs.b, vs.c);

            var color = levels[cacheIndex+1];

            addFace(vs.a, ab, ac,       vs.ca, color, color);
            addFace(vs.b, bc, ab,       vs.cb, color, color);
            addFace(vs.c, ac, bc,       vs.cc, color, color);
            addFace(ab, bc, ac,         color, color, color);
        }

        cacheIndex++;
    }


    var r = radius ;

    var t = (1.0 + Math.sqrt(5.0)) * 0.5 * r;

    var av = function(x, y, z) {
        var v = new SQR.V3(x, y, z).norm();
        v.normal = v.clone();
        if(options.reverseNormals) v.normal.neg();
        v.mul(radius);
        vectors.push(v);
    }

    var af = function(a, c, b) {
        var color = levels[0];
        addFace(vectors[a], vectors[b], vectors[c], color, color, color);
    }
    
    av(-r,  t,  0);
    av( r,  t,  0);
    av(-r, -t,  0);
    av( r, -t,  0);

    av( 0, -r,  t);
    av( 0,  r,  t);
    av( 0, -r, -t);
    av( 0,  r, -t);

    av( t,  0, -r);
    av( t,  0,  r);
    av(-t,  0, -r);
    av(-t,  0,  r);

    // 5 faces around point 0
    af(0, 11, 5);
    af(0, 5, 1);
    af(0, 1, 7);
    af(0, 7, 10);
    af(0, 10, 11);

    // 5 adjacent faces
    af(1, 5, 9);
    af(5, 11, 4);
    af(11, 10, 2);
    af(10, 7, 6);
    af(7, 1, 8);

    // 5 faces around point 3
    af(3, 9, 4);
    af(3, 4, 2);
    af(3, 2, 6);
    af(3, 6, 8);
    af(3, 8, 9);

    // 5 adjacent faces
    af(4, 9, 5);
    af(2, 4, 11);
    af(6, 2, 10);
    af(8, 6, 7);
    af(9, 8, 1);

    while(subdivisions-- > 0) subdivide();

    var geo = SQR.Buffer()
        .layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, faces.length * 3);

    var c = 0, t;
    faces.forEach(function(t) {
        if(options.flatShading) t.calculateNormal();
        c += t.toBuffer(geo, c, !options.flatShading);
    });

    return geo;
}