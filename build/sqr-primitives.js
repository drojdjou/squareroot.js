/* --- --- [primitives/Basic.js] --- --- */

/**
 *  @method createPoint
 *  @memberof SQR.Primitives
 *
 *  @description Creates a single 2d point
 *
 *	@param {Number} x - x position of the point
 *	@param {Number} y - y position of the point
 *
 *	@returns {SQR.Buffer}
 */
SQR.Primitives.createPoint = function(x, y) {
	return SQR.Buffer()
		.layout(SQR.v2(), 1)
		.setMode(SQR.gl.POINTS)
		.data('aPosition', x || 0, y || 0)
		.update();
}

/* --- --- [primitives/Cube.js] --- --- */

/**
 *  @method createCube
 *  @memberof SQR.Primitives
 *
 *  @description Creates a simple cube geometry, 1 quad per side, with UVs, non-indexed
 *
 *	@param {Number} w - width of the cube
 *	@param {Number} h - height of the cube
 *	@param {Number} d - depth of the cube
 *
 *	@returns {SQR.Buffer}
 */
SQR.Primitives.createCube = function(w, h, d) {

	w = w || 1;
	h = h || 1;
	d = d || 1;

	var geo = SQR.Buffer()
		.layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, 36);
	
	var v0 = new SQR.V3(w * -0.5,   h *  0.5,   d *  0.5); // Top left
	var v1 = new SQR.V3(w *  0.5,   h *  0.5,   d *  0.5); // Top right 
	var v2 = new SQR.V3(w * -0.5,   h * -0.5,   d *  0.5); // Bottom left 
	var v3 = new SQR.V3(w *  0.5,   h * -0.5,   d *  0.5); // Bottom right

	var v4 = new SQR.V3(w * -0.5,   h *  0.5,   d * -0.5); // Top left
	var v5 = new SQR.V3(w *  0.5,   h *  0.5,   d * -0.5); // Top right
	var v6 = new SQR.V3(w * -0.5,   h * -0.5,   d * -0.5); // Bottom left
	var v7 = new SQR.V3(w *  0.5,   h * -0.5,   d * -0.5); // Bottom right

	var u0 = new SQR.V2(0, 1);
	var u1 = new SQR.V2(1, 1);
	var u2 = new SQR.V2(0, 0);
	var u3 = new SQR.V2(1, 0);

	var faces = [];

	faces.push(SQR.Face().setPosition(v0, v1, v2, v3).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v5, v4, v7, v6).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v0, v6, v2).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v1, v5, v3, v7).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v4, v5, v0, v1).setUV(u0, u1, u2, u3));
	faces.push(SQR.Face().setPosition(v2, v3, v6, v7).setUV(u0, u1, u2, u3));
	
	var c = 0, t;
	faces.forEach(function(t) {
		c += t.calculateNormal().toBuffer(geo, c);
	});

	// SQR.Debug.traceBuffer(geo, true);
	
	return geo;
}

/* --- --- [primitives/Cylinder.js] --- --- */

/**
 *  @method createCylinder
 *  @memberof SQR.Primitives
 *
 *  @description Creates a cylinder with UVs, non-indexed
 *
 *  @param {Number} height - height of the cylinder
 *  @param {Number} radius - radius of the cylinder
 *  @param {Number} segments - number of segments along the cylinder
 *  @param {Object} optins - additional options
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

/* --- --- [primitives/Extrude.js] --- --- */

/*

       b(0,0,0)
          /\
         /__\
a(-1,2,0)    c(1,2,0)


spline(c1, c2, c3)

sc[
	a.1
	b.2
	c.3
]

sc [
	a.4
	b.5
	c.6
]

for each sc transform by curve matrix

f(sc[1].a, sc[2].b, sc[1].b)
f(sc[1].a, sc[2].a, sc[2].b)

f(sc[1].b, sc[2].c, sc[1].c)
f(sc[1].b, sc[2].b, sc[2].c)

f(sc[1].c, sc[2].a, sc[1].a)
f(sc[1].c, sc[2].c, sc[2].a)


set all sc to aPosition + aOrder
for each face set indices to indices

*/
SQR.Extrude = function() {

	var e = {};

	e.buffer = SQR.Buffer();

	var shape, shapeSize, path, resolution, range, start, end, cap;
	var vertices = [], faces = [];

	/**
	 *	_shape - array of SQR.V2 defining the profile shape
	 *	_path - SQR.Curve along which the extrude takes place
	 *	_resolution - how many times the shape will be repeated along the path. Less than 2 doesnt make sense, default is 10
	 *	_layout - the layout of the buffer to create, default SRQ.v3n3() i.e. a 3D vertex + 3D normal
	 */
	e.setPaths = function(_shape, _path, _resolution, _layout) {
		shape = _shape;
		shapeSize = _shape.length;
		path = _path;
		resolution = _resolution || 10;
		setVertices(_layout);
		return e;
	}

	e.makeCaps = function() {
		// TODO: implement
		return e;
	}

	var setVertices = function(layout) {
		vertices.length = 0;
		faces.length = 0;
		layout = layout || SQR.v3n3();

		for(var i = 0; i < resolution; i++) {
			for(var j = 0; j < shapeSize; j++) {
				var v = new SQR.V3();
				vertices.push(v);
			}
		}

		for(var i = 0; i < resolution - 1; i++) {
			for(var j = 0; j < shapeSize; j++) {
				// f(sc[1].a, sc[2].b, sc[1].b)
				// f(sc[1].a, sc[2].a, sc[2].b)
				var _1a = i * shapeSize + j;
				var _1b = (j < shapeSize - 1) ? _1a + 1 : i * shapeSize;
				var _2a = (i + 1) * shapeSize + j;
				var _2b = (j < shapeSize - 1) ? _2a + 1 : (i + 1) * shapeSize;

				var f1 = new SQR.Face().setPosition(vertices[_1a], vertices[_2b], vertices[_1b]);
				var f2 = new SQR.Face().setPosition(vertices[_1a], vertices[_2a], vertices[_2b]);

				faces.push(f1, f2);
			}
		}

		e.buffer.layout(layout, faces.length * 3);
	}

	var update = function(scalingFunc) {

		for(var i = 0; i < resolution; i++) {

			var tg = (i / (resolution - 1));
			var t = start + tg * range;
			var m = path.matrixAt(t);

			for(var j = 0; j < shapeSize; j++) {
				var v = vertices[i * shapeSize + j];
				v.copyFrom(shape[j]);
				if(scalingFunc) scalingFunc(tg, v);
				m.transformVector(v);
			}
		}

		var c = 0;
		for(var i = 0, fl = faces.length; i < fl; i++) {
			c += faces[i].calculateNormal().toBuffer(e.buffer, c, false, true);
		}
	}

	e.update = function(_start, _end, _scalingFunc) {
		start = _start || 0;
		end = _end || 1;
		range = (end - start);	
		update(_scalingFunc);
		e.buffer.update();
		return e;
	}

	return e;
}




















/* --- --- [primitives/Face.js] --- --- */

/**
 *  Face is a triangle or a quad.
 *  If the face is a quad, both triangles composin the quad,
 *  shader the same normal - thanks to this flat shaded materials have quads shaded
 *  the same way which is nicer than havong each triangle have a slightly different normal.
 *
 *  Currently it supports the following attributes: aPosition, aNormal, aUV.
 *
 *  @class Face
 *  @memberof SQR
 *
 */
SQR.Face = function() {

    var t = {};

    var ap = 'aPosition', an = 'aNormal', au = 'aUV';

    /**
     *  Set the vertex positions. For vertices a, b, c, and d is creates a quad as in the example below.
     *
     *  @method setPosition
     *  @memberof SQR.Face.prototype
     *
     *  @param {SQR.V3} a - the first vertex position
     *  @param {SQR.V3} b - the second vertex position
     *  @param {SQR.V3} c - the thrid vertex position
     *  @param {SQR.V3=} d - the optional fourth vertex position
     *
     *  @example
//
// a - b
// | / |
// c - d  
// 
// resulting triangles: `abc, cbd`
// 
     */
    t.setPosition = function(a, b, c, d) {
        t.a = a; 
        t.b = b; 
        t.c = c;
        t.d = d;
        return t;
    }

    /**
     *  Set the normal shared by all the vertices
     *  @method setNormal
     *  @memberof SQR.Face.prototype 
     */
    t.setNormal = function(n) {
        t.normal = n;
        return t;
    }

    /**
     *  Set the texture coordinates for each vertex
     *
     *  @method setUV
     *  @memberof SQR.Face.prototype 
     *
     *  @param {SQR.V2} a - the first vertex texture coordinate
     *  @param {SQR.V2} b - the second vertex texture coordinate
     *  @param {SQR.V2} c - the thrid vertex texture coordinate
     *  @param {SQR.V2=} d - the optional fourth vertex texture coordinate
     */
    t.setUV = function(uva, uvb, uvc, uvd) {
        t.uva = uva;
        t.uvb = uvb;
        t.uvc = uvc;
        t.uvd = uvd;
        return t;
    }

    /** 
     *  Set the vertex color for each vertex
     *  <br><br>
     *  <strong>WARNING! Colors are not passed to the buffer currently (will be added in the future).</strong>
     *
     *  @method setColor
     *  @memberof SQR.Face.prototype 
     *
     *  @param {SQR.V2} a - the first vertex color
     *  @param {SQR.V2} b - the second vertex color
     *  @param {SQR.V2} c - the thrid vertex color
     *  @param {SQR.V2=} d - the optional fourth vertex color
     */
    t.setColor = function(ca, cb, cc, cd) {
        t.ca = ca;
        t.cb = cb;
        t.cc = cc;
        t.cd = cd;
        return t;
    }

    /**
     *  Calculte the normal for this face. Regardless of whether there are 3 or 4 vertices
     *  the normal is calculated for the frst 3 of them an applied to the entire face.
     *  @method calculateNormal
     *  @memberof SQR.Face.prototype
     */
    t.calculateNormal = function() {
        var t1 = SQR.V3.__tv1;
        var t2 = SQR.V3.__tv2;
        t.normal = new SQR.V3();

        t1.sub(t.a, t.b);
        if(t1.isZero()) t1.sub(t.a, t.d);
        t2.sub(t.c, t.a);
        t.normal.cross(t1, t2);

        return t;
    }

    t.addNormalToVertices = function() {
        t.a.addNormal(t.normal);
        t.b.addNormal(t.normal);
        t.c.addNormal(t.normal);
        if(t.d) t.d.addNormal(t.normal);
        return t;
    }

    t.toBuffer = function(geo, position, perVertextNormal, preNormalizeNormal) {
        var c = position;

        if(geo.attributes[ap]) {
            geo.set(ap, c+0, t.a).set(ap, c+1, t.b).set(ap, c+2, t.c);
            if(t.d) geo.set(ap, c+3, t.c).set(ap, c+4, t.b).set(ap, c+5, t.d);
        }

        if(geo.attributes[an] && (t.normal || perVertextNormal)) {
            var v = perVertextNormal, n = t.normal;

            if(preNormalizeNormal && !v) t.normal.norm();

            geo.set(an, c+0, v ? t.a.normal : n)
               .set(an, c+1, v ? t.b.normal : n)
               .set(an, c+2, v ? t.c.normal : n);

            if(t.d) {
                geo.set(an, c+3, v ? t.c.normal : n)
                   .set(an, c+4, v ? t.b.normal : n)
                   .set(an, c+5, v ? t.d.normal : n);
            }
        }

        if(geo.attributes[au] && t.uva) {
            geo.set(au, c+0, t.uva).set(au, c+1, t.uvb).set(au, c+2, t.uvc);
            if(t.d) geo.set(au, c+3, t.uvc).set(au, c+4, t.uvb).set(au, c+5, t.uvd);
        }

        return t.d ? 6 : 3;
    }

    return t;
}

/* --- --- [primitives/Icosphere.js] --- --- */

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

        // var ab = Math.abs(ta.x - tb.x);
        // var bc = Math.abs(tb.x - tc.x);
        // var ca = Math.abs(tc.x - ta.x);

        // if(ab + bc + ca > 0.8) {

        //     // console.log("<o bef: ", ta.x, tb.x, tc.x);

        //     if(ta.x >= 0.8) ta.x -= 1;
        //     if(tb.x >= 0.8) tb.x -= 1;
        //     if(tc.x >= 0.8) tc.x -= 1;
        //     // console.log(" >o aft: ", ta.x, tb.x, tc.x);

        //     var ab = Math.abs(ta.x - tb.x);
        //     var bc = Math.abs(tb.x - tc.x);
        //     var ca = Math.abs(tc.x - ta.x);

        //     if(ab + bc + ca > 0.5) {

        //         // console.log(" >>> rec: ", ta.x, tb.x, tc.x);

        //         if(ta.x >= 0.5) ta.x = 0;
        //         if(tb.x >= 0.5) tb.x = 0;
        //         if(tc.x >= 0.5) tc.x = 0;

        //         // console.log(" >>>>>> pos: ", ta.x, tb.x, tc.x)
        //     }
        // }

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

/* --- --- [primitives/Plane.js] --- --- */

/**
 *  @method create2DQuad
 *  @memberof SQR.Primitives
 *
 *  @description Creates a 2d quad
 *
 *  @param {Number} x - x position of the quad
 *  @param {Number} y - y position of the quad
 *  @param {Number} w - width of the quad
 *  @param {Number} h - height of the quad
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.create2DQuad = function(x, y, w, h) {
	return SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
        .data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
        .update();
}

/**
 *  @method createPlane
 *  @memberof SQR.Primitives
 *
 *  @description Creates a plane, by default on the X/Y plane
 *
 *  @param {Number} w - width of the plane
 *  @param {Number} h - height of the plane
 *  @param {Number} wd - number of segments along the width
 *  @param {Number} hd - number of segments along the height
 *  @param {Number} wo - horizontal offset
 *  @param {Number} ho - vertical offset
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.createPlane = function(w, h, wd, hd, wo, ho) {

    var faces = [], vCols = [], uvCols = [];

    var geo = new SQR.Buffer();
    var options = options || {};
    
    geo.width = w;
    geo.height = h;

    var w = w * 0.5;
    var h = h * 0.5;

    var wo = wo || 0;
    var ho = ho || 0;

    var wd = wd || 1;
    var hd = hd || 1;

    faces.length = [];

    var wStart = -w + wo;
    var hStart = -h + ho;

    var wb = geo.width / wd;
    var hb = geo.height / hd;

    var i, j;

    for (i = 0; i < wd+1; i++) {
        vCols[i] = [];
        uvCols[i] = [];

        for (j = 0; j < hd+1; j++) {
            var bvStart = wStart + i * wb;
            var bhStart = hStart + j * hb;

            uvCols[i][j] = new SQR.V2(i/wd, j/hd);

            if (!options.zUp) {
                vCols[i][j] = new SQR.V3(bvStart, 0, bhStart);
            } else {
                vCols[i][j] = new SQR.V3(bvStart, bhStart, 0);
            }
        }
    }

    for (i = 0; i < wd; i++) {
        for (j = 0; j < hd; j++) {

            var bvStart = wStart + i * wb;
            var bvEnd = bvStart + wb;
            var bhStart = hStart + j * hb;
            var bhEnd = bhStart + hb;

            var va = vCols[i][j], vb = vCols[i][j+1], vc = vCols[i+1][j], vd = vCols[i+1][j+1];
            var uva = uvCols[i][j], uvb = uvCols[i][j+1], uvc = uvCols[i+1][j], uvd = uvCols[i+1][j+1];

            var q = new SQR.Face().setPosition(va, vb, vc, vd).setUV(uva, uvb, uvc, uvd);
            faces.push(q);
        }
    }

    geo.layout( {'aPosition': 3, 'aNormal': 3, 'aUV': 2 }, wd * hd * 6);

    var c = 0, t;
	faces.forEach(function(t) {
		c += t.calculateNormal().toBuffer(geo, c);
	});

    return geo;
}

/* --- --- [primitives/PostEffect.js] --- --- */

/**
 *  @function createPostEffect
 *  @memberof SQR.Primitives
 *
 *  @description Creates a post-processing effect (such as SAO or depth-of-field). It creares
 *	an instance of SQR.Transform with a full screen quad buffer and the shader build from the provided source.
 *	Please read the {@tutorial post-effects} tutorial to see how it works. 
 *
 *	@param {string} shaderSource - the source of the shader for this post effect
 *	@param {Object=} shaderOptions - options for the shader. Same as in the {@link SQR.Shader} constructor
 *
 *	@returns {SQR.Transform} a transform representing this post effect
 */
SQR.Primitives.createPostEffect = function(shaderSource, shaderOptions) {
    SQR.fullScreenQuad = SQR.fullScreenQuad || SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
        .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
        .update();

    var pe = new SQR.Transform();
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource, shaderOptions);

    return pe;
}

/* --- --- [primitives/Sphere.js] --- --- */

/**
 *  @method createSphere
 *  @memberof SQR.Primitives
 *
 *  @description Creates a simple cube geometry, 1 quad per side, with UVs, non-indexed
 *
 *  @param {Number} radius - radius of the sphere
 *  @param {Number} sw - width (longitude) segments
 *  @param {Number} sh - width (latitude) segments
 *  @param {Number} options - additional settings
 *
 *  @returns {SQR.Buffer}
 */
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












