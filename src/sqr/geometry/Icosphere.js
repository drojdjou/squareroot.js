SQR.Icosphere = function(options) {

    var faces = [], vectors = [];

    var vertices = [], normals = [], colors = [];

    var cache = [], cacheIndex = 0;

    var geo = new SQR.Geometry().quickSetup('v3n3c4');
    
    var radius;

    options = options || {};

    var levels = [
        [1, 0, 0, 1],
        [0, 1, 0, 2],
        [0, 0, 1, 3],
        [1, 1, 0, 4],
        [0, 1, 1, 5],
    ];

    var addVertex = function(v) {
        vectors.push(v);
    }

    var addFace = function(a, b, c, ca, cb, cc) {
        var f = new SQR.Triangle(options);
        f.setVertices(a, b, c);
        f.setAttribute(SQR.Geometry.COLOR, ca, cb, cc);
        faces.push(f);
    }

    // > http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
    geo.create = function(r) {

        radius = r;

        var t = (1.0 + Math.sqrt(5.0)) * 0.5 * r;

        var av = function(x, y, z) {
            vectors.push(new SQR.V3(x, y, z).norm().mul(radius));
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

        return geo.refresh();
    }

    var checkSubdivisionCache = function(v1, v2) {
        var l = vectors.length;

        for(var i = 0; i < l; i++) {
            var vc = vectors[i];

            var lr = vc.__v1 == v1 && vc.__v2 == v2;
            var rl = vc.__v2 == v1 && vc.__v1 == v2;

            if(lr || rl) return vc;
        }

        var v = new SQR.V3();
        v.sub(v1, v2).mul(0.5).appendVec(v2).norm().mul(radius);

        v.__v1 = v1;
        v.__v2 = v2;
        vectors.push(v);


        return v;
    }

    geo.subdivide = function() {
        cache[cacheIndex] = {};
        var c = cache[cacheIndex];

        c.faces = faces;
        c.vectors = vectors;
        faces = [];
        // vectors = [];

        var numTris = c.faces.length;

        for(var i = 0; i < numTris; i++) {
            var vs = c.faces[i].data(SQR.Geometry.VERTEX);
            var cs = c.faces[i].data(SQR.Geometry.COLOR);

            var ab = checkSubdivisionCache(vs.a, vs.b);
            var ac = checkSubdivisionCache(vs.a, vs.c);
            var bc = checkSubdivisionCache(vs.b, vs.c);

            var color = levels[cacheIndex+1];

            addFace(vs.a, ab, ac,       cs.a, color, color);
            addFace(vs.b, bc, ab,       cs.b, color, color);
            addFace(vs.c, ac, bc,       cs.c, color, color);
            addFace(ab, bc, ac,         color, color, color);
        }

        cacheIndex++;

        geo.refresh();
        return geo;
    }

    geo.refresh = function() {
        var numTris = faces.length;

        vertices.length = 0;
        normals.length = 0;
        colors.length = 0;

        var i, f

        for(i = 0; i < numTris; i++) {
            faces[i].calculateNormal();
        }

        for(i = 0; i < numTris; i++) {
            f = faces[i];
            f.toArray(SQR.Geometry.VERTEX, vertices);
            f.toArray(SQR.Geometry.NORMAL, normals);
            f.toArray(SQR.Geometry.COLOR, colors);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        geo.data(SQR.Geometry.COLOR, colors);
        
        return geo;
    }  

    geo.vectors = vectors;
    geo.cache = cache;

    return geo;
}
