SQR.Icosphere = function(options) {

    var faces = [], vectors = [];

    var vertices = [], normals = [], colors = [], texcoords = [];

    var cache = [], cacheIndex = 0;

    var geo = new SQR.Geometry().quickSetup('v3n3c4t2');
    
    var radius;

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

        // texTmp.norm();
        // var r = texTmp;
        // var m = 2.0 * Math.sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
        // tx = r.x / m + 0.5;
        // ty = r.y / m + 0.5;

        // tx = Math.atan2(v.z, v.x) / Math.PI/2;
        // ty = Math.acos(v.y/radius) / Math.PI;
        // tx += 0.5;

        tx = 1.0 - (0.5 + Math.atan2(texTmp.z, texTmp.x) / SQR.twoPI);
        ty = 1.0 - (0.5 - Math.asin(texTmp.y) / Math.PI);
        // tx = tx * 2 - 1;
        // tx = Math.abs(tx);

        // console.log(tx);

        // tx = Math.abs(tx);

       // float m;
       // vec3 r, u;
       // u = normalize(ecPosition3);
       // r = reflect(u, normal);
       // m = 2.0 * sqrt(r.x * r.x + r.y * r.y + (r.z + 1.0) * (r.z + 1.0));
       // return vec2(r.x / m + 0.5, r.y / m + 0.5);

        // var y = texTmp.y / radius;
        // texTmp.y = 0;
        // texTmp.norm();
        // tx = SQR.V3.dot(texTmp, forward) * 0.5 + 0.5;
        // if(tx < 0.5) tx *= 0.5;
        // ty = y * 0.5 + 0.5;

        return new SQR.V2(tx, ty);
    }

    var addFace = function(a, b, c, ca, cb, cc) {
        var f = new SQR.Triangle(options);
        f.setVertices(a, b, c);
        f.setAttribute(SQR.Geometry.COLOR, ca, cb, cc);

        var ta = getTexCoord(a);
        var tb = getTexCoord(b);
        var tc = getTexCoord(c);

        var ab = Math.abs(ta.x - tb.x);
        var bc = Math.abs(tb.x - tc.x);
        var ca = Math.abs(tc.x - ta.x);

        if(ab + bc + ca > 0.8) {

            // console.log("<o bef: ", ta.x, tb.x, tc.x);

            if(ta.x >= 0.8) ta.x -= 1;
            if(tb.x >= 0.8) tb.x -= 1;
            if(tc.x >= 0.8) tc.x -= 1;
            // console.log(" >o aft: ", ta.x, tb.x, tc.x);

            var ab = Math.abs(ta.x - tb.x);
            var bc = Math.abs(tb.x - tc.x);
            var ca = Math.abs(tc.x - ta.x);

            if(ab + bc + ca > 0.5) {

                // console.log(" >>> rec: ", ta.x, tb.x, tc.x);

                if(ta.x >= 0.5) ta.x = 0;
                if(tb.x >= 0.5) tb.x = 0;
                if(tc.x >= 0.5) tc.x = 0;

                // console.log(" >>>>>> pos: ", ta.x, tb.x, tc.x)
            }
        }

        f.setAttribute(SQR.Geometry.TEXCOORD, ta, tb, tc);
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

        // console.log("--- subdivide");

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
        texcoords.length = 0;

        var i, f

        for(i = 0; i < numTris; i++) {
            faces[i].calculateNormal(options.perVertexNormals);
        }

        for(i = 0; i < numTris; i++) {
            f = faces[i];
            f.toArray(SQR.Geometry.VERTEX, vertices);
            f.toArray(SQR.Geometry.NORMAL, normals);
            f.toArray(SQR.Geometry.COLOR, colors);
            f.toArray(SQR.Geometry.TEXCOORD, texcoords);
        }

        geo.data(SQR.Geometry.VERTEX, vertices);
        geo.data(SQR.Geometry.NORMAL, normals);
        geo.data(SQR.Geometry.COLOR, colors);
        geo.data(SQR.Geometry.TEXCOORD, texcoords);
        
        return geo;
    }  

    geo.vectors = vectors;
    geo.cache = cache;

    return geo;
}
