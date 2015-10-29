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
SQR.Primitives.createCube = function(w, h, d, options) {


	var V2 = this.V2, V3 = this.V3, F = this.F(options);

	w = w || 1;
	h = h || 1;
	d = d || 1;

	var geo = SQR.Buffer().layout(SQR.v3n3u2(), 36);
	
	var 
		v0 = V3(w * -0.5,   h *  0.5,   d *  0.5), // Top left
		v1 = V3(w *  0.5,   h *  0.5,   d *  0.5), // Top right 
		v2 = V3(w * -0.5,   h * -0.5,   d *  0.5), // Bottom left 
		v3 = V3(w *  0.5,   h * -0.5,   d *  0.5), // Bottom right

		v4 = V3(w * -0.5,   h *  0.5,   d * -0.5), // Top left
		v5 = V3(w *  0.5,   h *  0.5,   d * -0.5), // Top right
		v6 = V3(w * -0.5,   h * -0.5,   d * -0.5), // Bottom left
		v7 = V3(w *  0.5,   h * -0.5,   d * -0.5), // Bottom right

		u0 = V2(0, 1),
		u1 = V2(1, 1),
		u2 = V2(0, 0),
		u3 = V2(1, 0);

	F(v0, v1, v2, v3).uv(u0, u1, u2, u3);
	F(v5, v4, v7, v6).uv(u0, u1, u2, u3);
	F(v4, v0, v6, v2).uv(u0, u1, u2, u3);
	F(v1, v5, v3, v7).uv(u0, u1, u2, u3);
	F(v4, v5, v0, v1).uv(u0, u1, u2, u3);
	F(v2, v3, v6, v7).uv(u0, u1, u2, u3);
	
	F.toBuffer(geo);

	// SQR.Debug.traceBuffer(geo, true);
	
	return geo.update();
}

/*
SQR.Primitives.createSkybox = function(options) {

	options = options || {};
	options.size = options.size || 5;
	options.useDepth = (options.useDepth === undefined) ? false : options.useDepth;

	if(!options.glsl && SQR.GLSL) {
		if(options.use2dTextures) 
			options.glsl = SQR.GLSL['shaders/skybox-2d.glsl'];
		else 
			options.glsl = SQR.GLSL['shaders/skybox-cube.glsl'];
	}

	if(!options.glsl) throw "Missing shader code. Pass GLSL string as 2nd argument or include sqr-glsl.js to use the default one.";

	var skybox = new SQR.Transform();
	var shader = SQR.Shader(options.glsl);

	if(options.use2dTextures) {

		var planeOptions = { zUp: true };
		var s = options.size;
		var buffer = SQR.Primitives.createPlane(s, s, 1, 1, 0, 0, planeOptions);

		var side = function(name) {
			var f = new SQR.Transform(name);
			f.shader = shader;
			f.useDepth = options.useDepth;
			f.buffer = buffer;
			return f;
		}

		var front = side('front', planeOptions);
		front.position.z = s * -0.5;

		var back = side('back', planeOptions);
		back.position.z = s * 0.5;
		back.rotation.y = Math.PI;

		var left = side('left', planeOptions);
		left.position.x = s * -0.5;
		left.rotation.y = Math.PI * -0.5;

		var right = side('right', planeOptions);
		right.position.x = s * 0.5;
		right.rotation.y = Math.PI * 0.5;

		var up = side('up');
		up.position.y = s * 0.5;

		var down = side('down');
		down.position.y = s * -0.5;
		down.rotation.x = Math.PI;

		skybox.add(front, back, left, right, up, down);

		skybox.setTexture = function(f) {
			if(!f) return;

			console.log(f);

			front.uniforms = { uTexture: SQR.Texture(f.front) };
			back.uniforms = { uTexture: SQR.Texture(f.back) };
			left.uniforms = { uTexture: SQR.Texture(f.left) };
			right.uniforms = { uTexture: SQR.Texture(f.right) };
			up.uniforms = { uTexture: SQR.Texture(f.up) };
			down.uniforms = { uTexture: SQR.Texture(f.down) };
		}

	} else {

		var s = options.size;

		skybox.buffer = SQR.Primitives.createCube(s, s, s, { reverseNormals: true });
		skybox.shader = shader;
		skybox.useDepth = options.useDepth;

		skybox.setTexture = function(f) {
			if(!f) return;
			skybox.cubemap = SQR.Cubemap(f);
			skybox.shader.use().setUniform('uCubemap', skybox.cubemap);
		}
	} 

	if(options.faces) skybox.setTexture(options.faces);

	return skybox;
}
*/
























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

	var update = function(scalingFunc, ampFunc) {

		for(var i = 0; i < resolution; i++) {

			var tg = (i / (resolution - 1));
			var t = start + tg * range;
			var m = path.matrixAt(t);

			for(var j = 0; j < shapeSize; j++) {
				var v = vertices[i * shapeSize + j];
				v.copyFrom(shape[j]);
				if(scalingFunc) scalingFunc(tg, v, e);
				m.transformVector(v);
				if(ampFunc) ampFunc(tg, v, e);
			}
		}

		var c = 0;
		for(var i = 0, fl = faces.length; i < fl; i++) {
			c += faces[i].calculateNormal().toBuffer(e.buffer, c, false, true);
		}
	}

	e.update = function(_start, _end, _scalingFunc, _ampFunc) {
		start = _start || 0;
		end = _end || 1;
		range = (end - start);	
		update(_scalingFunc, _ampFunc);
		e.buffer.update();
		return e;
	}

	return e;
}




















/* --- --- [primitives/Face.js] --- --- */

/**
 *  @description Face is a triangle or a quad.
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
	if(!(this instanceof SQR.Face)) return new SQR.Face();
}

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
SQR.Face.prototype.setPosition = function(a, b, c, d) {
	var t = this;
	t.a = a || new SQR.V3(); 
	t.b = b || new SQR.V3(); 
	t.c = c || new SQR.V3();
	t.d = d;
	return t;
}

SQR.Face.prototype.setIndex = function(va, ia, ib, ic, id) {
	var t = this;
	t.indexed = true;
	t.ia = ia;
	t.ib = ib;
	t.ic = ic;
	t.id = id;
	t.vertexArray = va;
	return t;
}

SQR.Face.prototype.flip = function() {
	var t = this;
	var tmp = t.b;
	t.b = t.c;
	t.c = tmp;
}

/**
 *  Set the normal shared by all the vertices
 *  @method setNormal
 *  @memberof SQR.Face.prototype 
 */
SQR.Face.prototype.setNormal = function(n) {
	this.normal = n;
	return this;
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
SQR.Face.prototype.setUV = function(uva, uvb, uvc, uvd) {
	var t = this;
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
SQR.Face.prototype.setColor = function(ca, cb, cc, cd) {
	var t = this;
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
SQR.Face.prototype.calculateNormal = function() {
	var t = this;
	var t1 = SQR.V3.__tv1;
	var t2 = SQR.V3.__tv2;
	var va = t.vertexArray;
	t.normal = t.normal || new SQR.V3();

	if(t.indexed) {
		t1.sub(va[t.ia], va[t.ib]);
		if(t1.isZero()) t1.sub(va[t.ia], va[t.id]);
		t2.sub(va[t.ic], va[t.ia]);
	} else {
		t1.sub(t.a, t.b);
		if(t1.isZero()) t1.sub(t.a, t.d);
		t2.sub(t.c, t.a);
	}


	t.normal.cross(t1, t2);

	return t;
}

SQR.Face.prototype.v = SQR.Face.prototype.setPosition;
SQR.Face.prototype.i = SQR.Face.prototype.setIndex;
SQR.Face.prototype.n = SQR.Face.prototype.setNormal;
SQR.Face.prototype.uv = SQR.Face.prototype.setUV;
SQR.Face.prototype.cl = SQR.Face.prototype.setColor;
SQR.Face.prototype.cn = SQR.Face.prototype.calculateNormal;

SQR.Face.prototype.addNormalToVertices = function() {
	var t = this;
	var va = t.vertexArray;

	var a = t.indexed ? va[t.ia] : t.a;
	var b = t.indexed ? va[t.ib] : t.b;
	var c = t.indexed ? va[t.ic] : t.c;
	var d = t.indexed ? va[t.id] : t.d;

	a.addNormal(t.normal);
	b.addNormal(t.normal);
	c.addNormal(t.normal);
	if(d) d.addNormal(t.normal);
	return t;
}

SQR.Face.prototype.toBuffer = function(geo, position, perVertextNormal, preNormalizeNormal) {
	var t = this;
	var ap = 'aPosition', an = 'aNormal', au = 'aUV';
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

/* --- --- [primitives/Mesh.js] --- --- */

/**
 *  @namespace Mesh
 *  @memberof SQR
 *
 *  @description Attempt to create a decorator for a buffer that will be able to process 
 *	the data (position, normals and tangents) as it if was a collection of faces.
 *
 *	
 *
 */
SQR.Mesh = function(buffer) {

	var m = {};

	// Create a face and a normal vector for reuse in loop below
	var f = new SQR.Face().setPosition(new SQR.V3(), new SQR.V3(), new SQR.V3());
	f.a.normal = new SQR.V3();
	f.b.normal = new SQR.V3();
	f.c.normal = new SQR.V3();
	var n = new SQR.V3();

	m.calculateNormals = function() {

		var index = buffer.getIndexArray();
		var data = buffer.getDataArray();

		// This method does the assumption that the aPosition attribute is the first one
		for(var i = 0; i < buffer.indexSize; i += 3) {

			var s = buffer.strideSize;
			var o0 = index[i+0] * s;
			var o1 = index[i+1] * s;
			var o2 = index[i+2] * s;

			f.a.set(data[o0+0], data[o0+1], data[o0+2]);
			f.b.set(data[o1+0], data[o1+1], data[o1+2]);
			f.c.set(data[o2+0], data[o2+1], data[o2+2]);

			f.a.normal.set(data[o0+3], data[o0+4], data[o0+5]);
			f.b.normal.set(data[o1+3], data[o1+4], data[o1+5]);
			f.c.normal.set(data[o2+3], data[o2+4], data[o2+5]);

			f.calculateNormal();
			f.normal.norm();
			f.addNormalToVertices();

			data[o0+3] = f.a.normal.x;
			data[o0+4] = f.a.normal.y;
			data[o0+5] = f.a.normal.z;

			data[o1+3] = f.b.normal.x;
			data[o1+4] = f.b.normal.y;
			data[o1+5] = f.b.normal.z;

			data[o2+3] = f.c.normal.x;
			data[o2+4] = f.c.normal.y;
			data[o2+5] = f.c.normal.z;
		}

		buffer.iterate('aNormal', function(i, data, c) {
			n.set(data[i+0], data[i+1], data[i+2]).norm();

			data[i+0] = n.x;
			data[i+1] = n.y;
			data[i+2] = n.z;
		});

		buffer.update();
	};

	return m;
}



/**
 *	@method fromJSON
 *	@memberof SQR.Mesh
 *
 *	@param {Object | string} data - the mesh data or an object containing a named list of meshes 
 *	(which is how meshes get exported from unity by default - the names are the uuids of the object)
 *
 *	@param {string=} name - the name of the mesh in the list. 
 *	If data is a list of meshes and name is omitted, the function will pick the first mesh on the list.
 *	If data is the mesh data itself, this argument will be ignored.
 *
 *	@param {Object=} options - advanced options for mesh construction
 *
 *	@description <p>Utility to load meshes from JSON files in the 
 *	format as exported from the Unity exporter.</p>
 *
 *	<p>Parses the J3D JSON mesh data format and creates an instance SQR.Buffer out of it.</p>
 *
 *	<p>This is the best way to work with 3d models, since SQR doesn't have native support for OBJ files or Collada 
 *	(though it's perfectly possible to create an OBJ or Collada importer if you need to).</p>
 */	
SQR.Mesh.fromJSON = function(data, name, options) {

	var geo;

	options = options || {};

	if(name) {
		// data is a list of meshesh from Unity and we provide a name
		geo = data[name];
	} else if(data.vertices) {
		// data is the mesh itself
		geo = data;
	} else {
		// data is a list of meshes from Unity but we didn't provide a name

		// Unity exported mesh files can have one or more meshes. 
		// Even if there's only one mesh, it is stored as property
		// where the key is the mesh uuid. This code will attempt
		// to find the first mesh, so that on JS side we don't have to 
		// pass the uuid in the constructor
		for(var d in data) {
			geo = data[d];
			break;
		}
	}

	if(!geo) throw "> SQR.Mesh - mesh not found in data (name: " + name + ")";

	// This is to be able to work with old JSON format. Needs to go away at some point.
	var legacyAttribute = {
		aPosition: 'vertices',
		aNormal: 'normals',
		aColor: 'colors',
		aUV: 'uv1',
		aUV2: 'uv2',
		aTangent: 'tangent',
		aWeight: 'boneWeights',
		aIndex: 'boneIndices',
		indices: 'tris'
	};

	var getAttributeData = function(n) {
		var d = geo[n] || geo[legacyAttribute[n]];
		if(d && d.length > 0) return d;
		else return null; 
	}

	var layout = options.layout || data.layout || SQR.v3n3u2();
	var vs = options.vertexSize || layout.aPosition;
	var size = (geo.vertices || geo.aPosition).length / vs;

	var buffer = SQR.Buffer().layout(layout, size);

	for(var a in layout) {
		var d = getAttributeData(a);
		if(d) buffer.data(a, d);
	}

	var i = getAttributeData('indices');
	if(i) buffer.index(i);

	buffer.mesh = SQR.Mesh(buffer);

    return buffer.update();
};

/* --- --- [primitives/Plane.js] --- --- */

 /*
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
// SQR.Primitives.create2DQuad = function(x, y, w, h) {
// 	return SQR.Buffer()
// 		.layout(SQR.v2u2(), 6)
// 		.data('aPosition',   x, y+h,   x+w, y,     x+w, y+h,    x+w, y,    x, y+h,    x, y)
// 		.data('aUV',         0, 0,     1,   1,     1,   0,      1,   1,    0, 0,      0, 1)
// 		.update();
// }

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
 *	@param {Object} options - options for the plan construction
 *
 *  @returns {SQR.Buffer}
 */
SQR.Primitives.createPlane = function(w, h, wd, hd, wo, ho, options) {

	var faces = [], indices = [];

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
	var vertices = [], uvs = [];

	for (i = 0; i < wd+1; i++) {
		for (j = 0; j < hd+1; j++) {
			var bvStart = wStart + i * wb;
			var bhStart = hStart + j * hb;
			var ij = i * (hd+1) + j;

			uvs[ij] = new SQR.V2(i/wd, j/hd);

			if (!options.zUp) {
				vertices[ij] = new SQR.V3(bvStart, 0, bhStart);
			} else {
				vertices[ij] = new SQR.V3(bvStart, bhStart, 0);
			}
		}
	}

	for (i = 0; i < wd; i++) {
		for (j = 0; j < hd; j++) {

			var bvStart = wStart + i * wb;
			var bvEnd = bvStart + wb;
			var bhStart = hStart + j * hb;
			var bhEnd = bhStart + hb;

			var ij = i * (hd+1) + j;
			var ij2 = (i+1) * (hd+1) + j;

			var q = new SQR.Face().setIndex(vertices, ij, ij+1, ij2, ij2+1);
			faces.push(q);
			indices.push(ij, ij+1, ij2,   ij2, ij+1, ij2+1);
		}
	}


	layout = (options.layout) ? options.layout : {};

	layout.aPosition = 3;
	layout.aNormal = 3;
	layout.aUV = 2;

	geo.layout(layout, vertices.length);

	geo.faces = faces;
	geo.vertices = vertices;

	geo.recalculateNormals = function() {
		faces.forEach(function(f) {
			f.calculateNormal();
			f.addNormalToVertices();
		});

		return geo;
	}

	geo.updateFromFaces = function() {

		geo.iterate('aPosition', function(i, data, c) {
			var v = vertices[c];
			data[i+0] = v.x;
			data[i+1] = v.y;
			data[i+2] = v.z;
		});

		geo.iterate('aNormal', function(i, data, c) {
			var v = vertices[c];
			v.normal.norm();
			data[i+0] = v.normal.x;
			data[i+1] = v.normal.y;
			data[i+2] = v.normal.z;
		});

		geo.iterate('aUV', function(i, data, c) {
			var v = uvs[c];
			data[i+0] = v.x;
			data[i+1] = v.y;
		});

		geo.index(indices);

		return geo;
	}


	return geo.recalculateNormals().updateFromFaces().update();
}
















/* --- --- [primitives/PostEffect.js] --- --- */

/**
 *  @function createPostEffect
 *  @memberof SQR.Primitives
 *
 *  @description Creates a post-processing effect (such as SAO or depth-of-field). It creates
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

    var pe = new SQR.Transform('post-effect');
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource, shaderOptions);

    return pe;
}


// SQR.Primitives.createImage = function(img, mode, shaderSource, shaderOptions) {

// 	if(!shaderSource && !SQR.GLSL) throw '> SQR.Primitives.createImage > sqr-glsl.js package is required to use this feature.';
//     shaderSource = shaderSource || SQR.GLSL['post/image.glsl'];

// 	var pe = new SQR.Transform();

//     pe.buffer = SQR.Buffer()
//         .layout(SQR.v2u2(), 6)
//         .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
//         .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
//         .update();

//     var image = img;
//     var texture = SQR.Texture(image);
//     pe.shader = SQR.Shader(shaderSource, shaderOptions);

//     pe.setImage = function(img) {
//         image = img;
//         texture.setSource(img).update();
//         pe.shader.use().setUniform('uTexture', texture);
//     }

//     pe.setImage(image);

//     pe.size = function(w, h) {

//         var xl = -1, yt = 1, xr = 1, yb = -1;
//         var iw = image.width, ih = image.height;

//         var fw = iw / ih * h;
//         var fh = ih / iw * w;

//         if(mode == 'fit') {
//             if(fw > w) {
//                 yb = -(fh / h);
//                 yt =  (fh / h);
//             }

//             if(fh > h) {
//                 xl = -(fw / w);
//                 xr =  (fw / w);
//             }
//         } else if(mode == 'cover') {    
//             if(fw > w) {
//                 xl = -(fw / w);
//                 xr =  (fw / w);
//             }

//             if(fh > h) {
//                 yb = -(fh / h);
//                 yt =  (fh / h);
//             }
//         }

//         pe.buffer.data('aPosition', 
//             xl, yt,
//             xr, yt,
//             xr, yb,

//             xl, yt,
//             xr, yb,
//             xl, yb
//         ).update();

//         return pe;
//     }

// 	return pe;
// }










/* --- --- [primitives/SceneParser.js] --- --- */

/**
 *  @namespace SceneParser
 *  @memberof SQR
 *
 *  @description Utility to load scenes from J3D/Unity exported JSON files.
 *
 */
SQR.SceneParser = (function() {

	var skinnedMeshLayout = function() { return { aPosition: 3, aNormal: 3, aUV: 2, aWeight: 4, aIndex: 4 } };

	var arrayToObject = function(a, v) {
		v.x = a[0];
		v.y = a[1];
		v.z = a[2];
		if(v.w) v.w = a[3];
	}

	return {

		/**
		 *	@method fromJSON
		 *	@memberof SQR.SceneParser
		 *
		 *	@description Parses the J3D JSON scene data format and creates a SQR.Buffer out of it.
		 *
		 *	@param {Object} assets The assets loaded with SQR.Loader or otherwise. 
		 *	This method will expect to find all the 3 exported files in there, named 'scene', 'mesh' and 'anim'. 
		 *	Alternatively a prefix can be provided in the seconds, options argument.
		 *
		 *	@param {Object} options Options on how to parse the scene.
		 */	
		parse: function(assets, options) {

			options = options || {};

			var prefix = options.prefix || '';
			var scene = assets[prefix + 'scene'];
			var meshes = assets[prefix + 'mesh'];
			var anim = assets[prefix + 'anim'];

			if(options.context) {
				var bc = scene.background;
				options.context.clearColor(bc.r, bc.g, bc.b);
			};

			var getDefaultShader = (function() {
				var d;
				return function() {
					if(!d) d = SQR.Shader(options.shader);
					return d;
				}
			})();

			// If this is a scene coming from unity we need to flip the matrix
			// TODO: this doesn't play well with the WebVR thing btw....
			SQR.flipMatrix = (options && options.flipMatrix) ? options.flipMatrix : false;

			var buffers = {}, bufferByName = {};
			var skinnedMeshes = [];
			var animations = {};

			for(var n in meshes) {
				var md = meshes[n];

				var layout = md.boneWeights ? skinnedMeshLayout() : SQR.v3n3u2();

				var b = SQR.Mesh.fromJSON(md, null, { layout: layout });
				buffers[n] = b;
				bufferByName[md.name] = b;
			}

			for(var m in scene.materials) {
				var mat = scene.materials[m];
				mat.color = SQR.Color().setRGB(mat.color.r, mat.color.g, mat.color.b);
			}

			var root = new SQR.Transform();
			var camera;
			var ts = scene.transforms;

			ts.forEach(function(td) {
				var t = new SQR.Transform(td.name, td.uid);
				t.useQuaternion = true;
				arrayToObject(td.position, t.position);
				arrayToObject(td.rotation, t.quaternion);

				t.data = td;
				if(td.bones) skinnedMeshes.push(t);

				if(td.camera) {
					camera = t;
					var cd = scene.cameras[td.camera];

					var resize = function() {
						var w = window.innerWidth, h = window.innerHeight, aspect = w/h;
						camera.projection = new SQR.ProjectionMatrix().perspective(cd.fov, aspect, cd.near, cd.far);
					}

					window.addEventListener('resize', resize);
					resize();
				}

				if(td.mesh) {
					t.buffer = buffers[td.meshId];
					
				}

				
				if(td.renderer) {

					// we will deal with skinned meshes below
					if(!td.bones) t.shader = getDefaultShader();

					t.uniforms = t.uniforms || {};
					t.uniforms.uColor = scene.materials[td.renderer].color;
					
				}

				if(td.parent) {
					root.findById(td.parent).add(t);
				} else {
					root.add(t);
				}
			});

			skinnedMeshes.forEach(function(s) {
				var bs = s.data.bones, bst = [], numBones = bs.length;
				
				bs.forEach(function(id) {
					bst.push(root.findById(id));
				});

				bst[0].setAsBoneRoot();

				var boneMatrices = [];

				s.shader = SQR.Shader(options.shader, {
					directives: [
						{ name: 'NUM_BONES', value: numBones },
						{ name: 'BONE_PER_VERTEX', value: 4 }
					]
				});

				s.beforeDraw = function() {

					for(var i = 0; i < numBones; i++) {
						boneMatrices[i] = bst[i].computeBoneMatrix();
					}

					s.shader.use().setUniform('uBones', boneMatrices);
				}
			});

			for(var id in anim) {

				var data = anim[id];

				animations[id] = {
					duration: data.length,
					transforms: {}
				};

				for(var c in data.curves) {

					animations[id].transforms[c] = {
						properties: {}
					};

					for(var p in data.curves[c]) {
						var keyframes = [];
						var d = data.curves[c][p];

						if(options.linearAnimation) {
							for(var i = 0; i < d.keys.length; i += 4) {
								var a = d.keys[i + 0];
								var b = d.keys[i + 1];
								keyframes.push(new SQR.V2(a, b));								
							}
						} else {
							for(var i = 0; i < d.keys.length - 4; i += 4) {
								var k1t = d.keys[i+0];
								var k1v = d.keys[i+1];
								var k1o = d.keys[i+3];

								var k2t = d.keys[i+4];
								var k2v = d.keys[i+5];
								var k2i = d.keys[i+6];
								
								var start = new SQR.V2(k1t, k1v);
								var end = new SQR.V2(k2t, k2v);

								var dt = (end.x - start.x) / 3.0;
								var st = new SQR.V2( dt,  dt * k1o).add(start);
								var et = new SQR.V2(-dt, -dt * k2i).add(end);

								keyframes.push(new SQR.Bezier(start, st, et, end));
							}
						}

						animations[id].transforms[c].properties[p] = keyframes;
					}
				}
			}

			root.recurse(function(t) {
				if(t.data && t.data.animationId) {
					var id = t.data.animationId;
					var data = animations[id];

					// Aniation file is missing or was not exported, abort.
					if(!data) return;

					t.animation = SQR.Animation(data.duration);

					for(var cn in data.transforms) {
						var c = t.findByPath(cn);
						c.clip = SQR.Clip(data.duration);
						t.animation.addClip(c.clip);

						for(var p in data.transforms[cn].properties) {
							c.clip.addProperty(p, data.transforms[cn].properties[p]);
						}
					}

					if(options.autoPlay) t.animation.play();
				};
			}, true);

			return {
				root: root, camera: camera, buffers: bufferByName
			};
		}

	}

})();

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

    return geo.update();
}












