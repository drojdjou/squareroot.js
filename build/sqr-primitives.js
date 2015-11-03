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

	w = w || 1;
	h = h || 1;
	d = d || 1;
	options = options || {};

	var m = new SQR.Mesh();


	var 
		v0 = m.V(w * -0.5,   h *  0.5,   d *  0.5), // Top left
		v1 = m.V(w *  0.5,   h *  0.5,   d *  0.5), // Top right 
		v2 = m.V(w * -0.5,   h * -0.5,   d *  0.5), // Bottom left 
		v3 = m.V(w *  0.5,   h * -0.5,   d *  0.5), // Bottom right

		v4 = m.V(w * -0.5,   h *  0.5,   d * -0.5), // Top left
		v5 = m.V(w *  0.5,   h *  0.5,   d * -0.5), // Top right
		v6 = m.V(w * -0.5,   h * -0.5,   d * -0.5), // Bottom left
		v7 = m.V(w *  0.5,   h * -0.5,   d * -0.5), // Bottom right

		u0 = m.T(0, 1),
		u1 = m.T(1, 1),
		u2 = m.T(0, 0),
		u3 = m.T(1, 0);

	
	m.F(v0, v1, v2, v3).T(u0, u1, u2, u3);
	m.F(v5, v4, v7, v6).T(u0, u1, u2, u3);
	m.F(v4, v0, v6, v2).T(u0, u1, u2, u3);
	m.F(v1, v5, v3, v7).T(u0, u1, u2, u3);
	m.F(v4, v5, v0, v1).T(u0, u1, u2, u3);
	m.F(v2, v3, v6, v7).T(u0, u1, u2, u3);

	m.calculateNormals(options.smooth);
	if(options.flip) m.flip();

	return m.update();


	// var V2 = this.V2, V3 = this.V3, F = this.F(options);

	// w = w || 1;
	// h = h || 1;
	// d = d || 1;

	// var geo = SQR.Buffer().layout(SQR.v3n3u2(), 36);
	
	// var 
	// 	v0 = V3(w * -0.5,   h *  0.5,   d *  0.5), // Top left
	// 	v1 = V3(w *  0.5,   h *  0.5,   d *  0.5), // Top right 
	// 	v2 = V3(w * -0.5,   h * -0.5,   d *  0.5), // Bottom left 
	// 	v3 = V3(w *  0.5,   h * -0.5,   d *  0.5), // Bottom right

	// 	v4 = V3(w * -0.5,   h *  0.5,   d * -0.5), // Top left
	// 	v5 = V3(w *  0.5,   h *  0.5,   d * -0.5), // Top right
	// 	v6 = V3(w * -0.5,   h * -0.5,   d * -0.5), // Bottom left
	// 	v7 = V3(w *  0.5,   h * -0.5,   d * -0.5), // Bottom right

	// 	u0 = V2(0, 1),
	// 	u1 = V2(1, 1),
	// 	u2 = V2(0, 0),
	// 	u3 = V2(1, 0);

	// F(v0, v1, v2, v3).uv(u0, u1, u2, u3);
	// F(v5, v4, v7, v6).uv(u0, u1, u2, u3);
	// F(v4, v0, v6, v2).uv(u0, u1, u2, u3);
	// F(v1, v5, v3, v7).uv(u0, u1, u2, u3);
	// F(v4, v5, v0, v1).uv(u0, u1, u2, u3);
	// F(v2, v3, v6, v7).uv(u0, u1, u2, u3);
	// F.toBuffer(geo);
	// return geo.update();
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
 *  Currently it supports the following attributes: aPosition, aNormal, aUV and aColor. 
 *	Should support aTangent and aBinormal soon too.
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
 *  @description <p>A higher level wrapper for buffers designed 
 *	to make management of 3d solid objects easier.</p>
 */

/*
 *	<h3>Some theory about meshesh</h3>
 *
 *	<p>A buffer is an array composed of an abritrary number of attributes. Their names and size can express anything 
 *	- somtimes position, but also angle, radius, size, speed, velocity, mass... you name it. It will all work ok as long as there 
 *	we write a shader that can interpret those attributes and translate them into a vertex position. 
 *	This is great for for particle systems and other fancy shapes.</p>
 *
 *	<p>However, there are cases where we simply need to draw a mesh that is a solid object.
 *	These meshes are not as diverse in their structure. They typically all have the same set of attributes. 
 *	These inlude:</p>
 *
 *	<ol>
 *		<li>aPosition - the 3d position of the vertex</li>
 *		<li>aNormal - the normal of the vertex</li>
 *		<li>aUV - the texture coordinate of the vertex</li>
 *		<li>aUV2 - secondary texture coordinate of the vertex (for lightmapping or whatever)</li>
 *		<li>aTangent - the tangent of the vertex for normal mapping</li>
 *		<li>aBinormal - the binomal of the vertex for normal mapping 
 *			(not sure if this is actually useful, maybe can be computer in the shader?)</li>
 *		<li>aWeight - the bone weights</li>
 *		<li>aIndex - the bone indices</li>
 *		<li>aColor - the vertex color</li>
 *	</ol>
 *
 *	<p>Now, a lot of meshes will come from the Unity exporter and they will have some or all of the above attributes. With things like
 *	boneWieght and boneIndices it would be insane to try to create them in code (I tried).
 *	So most cases it is best to take the exported data, push it into a buffer and not have a Mesh at all. Expect in two cases:
 *	</p>
 *
 *	<ul>
 *		<li>The mesh is supposed to be animated per-vertex in Javascript (not in shader)</li>
 *		<li>The mesh lacks normal, tangent or binormal data and these need to be calculated before rendering</li>
 *	</ul>
 *
 *	<p>So moving vertex positions around and recalculating normals (or tangents and binormals, which is similar) are the two 
 *	most important features that the Mesh class should deal with. It's worth noting that after the vertices positions are moved, 
 *	recalculating the normals is the necessary next step in most cases anyway - so the two are tied together. Attributes such as UVs
 *	will almost never be animated (I can't think of a scenario where this would make sense). A color attribute can be animated, but usually
 *	this one is very rarely used.</p>
 *
 *	<p>Meshes are often indexed but it's not as staightforward as it may seem. Indexing vertex positions is simple and elegant, but often 
 *	we need to have one vertex position to have more than one different texture coordinates because every face the vertex is attached 
 *	to will have it's own texture mapping. Same goes for normals - if we need to have 100% flat shading, every face needs to have it's 
 *	own vertices and not share it with any other face.</p>
 *
 *	<p>This can get pretty involved to figure out ex. how to break the vertices based on the angle between the faces. We could implement it 
 *	some day, but given that Unity handles this already it seems a bit overkill. Instead we can opt for calculating averaged normals for 
 *	each vertex that is shared by more than one face for meshes imported from Unity.</p>
 *
 *	<p>Another category are realtime primitives (cubes, spheres, planes) and other realtime generated meshes. This is where the Mesh
 *	class is going to be most useful. The idea here is to be able to create faces (tris or quads) based on vertex position and 
 *	add other attributes - either manually or by some kind of computation.</p>
 *
 *	<p>When it comes to adding attributes based on some algorithm - in most cases it means it will be derived from vertex positions.
 *	The most basic example is of course calculating normals, but other good example is calculating texture coordinates based on some
 *	mapping system (cubic, spherical etc...) or vertex color also based on some sort of mapping.</p>
 *
 *	<p>Manually adding attributes in code seems impractical. For example it is far easier to perform a custom texture mapping in a
 *	3d software such as C4D than to try to add the mapping in code. So let's just forget about it and focus on what code is 
 *	good at - computation.</p>
 *
 *	<p>Let's examine 3 simple cases and 2 more complex ones.</p>
 *
 *	<p>Case 1: a plane. A plane is trivial. The normals are all the same and all point up from the surface of the plane. The UV mapping
 *	is trivial as well - each vertex UV coordinate is based on it's porportional position in the plane and the entire plane is mapped to
 *	texture coords going from 0 to 1 on both u and c axes. This kind of mesh could actually be indexed on the buffer level and draw using 
 *	drawElements.</p>
 *
 *	<p>Case 2: a sphere. Sphere is also pretty simple - normals are basically normalized vertex positions and UV mapping is derived from 
 *	the latitude and longitude of each vertex. Typically the vertex positions themselves are calculated from angle during the creation of
 *	the mesh.</p>
 *
 *	<p>Case 3: a cube. A cube is composed of six planes, so same rules apply. Actuall the entire cube creation code can consist of creating
 *	six planes and merging them together.</p>
 *
 *	<p>Case 4: a plane with a height map or vertex animation (cloth, water, terrain). It starts with a plane that is subdivided. The UV mapping is the same.
 *	Then the vertex positions can be moved around (typically for a XZ plane, we move the Y position up and down) and normals (tangents etc)
 *	can be recalculated. Since the plane is subdivided anbd not flat we can either average normals and make it smooth or 
 *	make them flat shaded.</p>
 *
 *	<p>Case 5: pyramid, cylinder or cone, or any other primitive shape. The positions for those shapes can be generated with code and normals
 *	can be derived from these positions. However, there is no obvious way to come up with UV coordinates. Texture mapping algorithms can be helpful
 *  in this case, or, if we go with a low poly esthetic we can skip UVs entirely.</p>
 *
 *	<p>Except for Case 1, all the other meshes do not lend themselves easily to indexing. It can be done, but it will result in complex code and 
 *	we're not sure if it is worth the effort. Instead, we can load all the vertices to the buffer separately. However, it makes total sense to keep
 *	a list of vertices shared by faces but not duplicated for each face. This will make it possible to modulate their position without having the
 *	mesh break and also it will make it possible to calculate smooth normals.</p>
 *
 *	<p>This leads to the conclusion that realtime meshes should not be indexed at all on the buffer level, but reusing vertex objects on the JS side
 *	is a good idea.</p>
 *
 *	<p>PS. This about <a href='http://marcinignac.com/blog/fast-dynamic-geometry-in-webgl/'>this</a>. Honestly
 *	it sounds very resnoable, but code tests I did now do not prove that this is the best way (not to mention
 *	the resulting code complexity...)</p>
 */
SQR.Mesh = function() {

	if(!(this instanceof SQR.Mesh)) return new SQR.Mesh();

	var m = this;

	m.polys = [];
	m.vertices = [];
	m.uvs = [];
	m.size = 0;

	m.addVertex = function(x, y, z) {
		var v = new SQR.Vertex(x, y, z);
		m.vertices.push(v);
		return m.vertices.length - 1;
	};

	m.addUV = function(u, v) {
		var v = new SQR.V2(u, v);
		m.uvs.push(v);
		return m.uvs.length - 1;
	}

	m.addFace = function() {
		var p = new SQR.Poly(m);
		p.V.apply(p, arguments);
		m.polys.push(p);
		m.size += p.triangles.length;
		return p;
	};

	
	m.calculateNormals = function(s) {

		m.smooth = s;

		for(var i = 0, l = m.polys.length; i < l; i++) {
			m.polys[i].calculateNormal();
		}

		if(m.smooth) {
			for(var i = 0, l = m.vertices.length; i < l; i++) {
				if(m.vertices[i].polys) m.vertices[i].calculateNormal();
			}
		}

		return m;
	};

	m.flip = function() {
		for(var i = 0, l = m.polys.length; i < l; i++) {
			m.polys[i].flip();
		}

		return m;
	}

	m.calculateTangents = function() {
		console.log('SQR.Mesh.calculateTangents is not implemented yet!');
	};

	var createBuffer = function() {

		var p = m.polys[0];

		var s = m.size;

		var l = { aPosition: 3 };
		if(p.normal) l.aNormal = 3;
		if(p.uvs.length > 0) l.aUV = 2;

		m.buffer = SQR.Buffer().layout(l, s);
		return m.buffer;
	}

	m.update = function() {

		if(m.polys.length == 0) {
			console.warn('> SQR.Mesh.update > no polys found to create buffer from.');
			return;
		}

		var b = m.buffer || createBuffer();

		var p = b.attributes.aPosition, c = 0;

		var transport = [];
		
		for(var i = 0, ml = m.polys.length; i < ml; i++) {

			var pl = m.polys[i];

			for(var j = 0, vl = pl.triangles.length; j < vl; j++) {

				var ti = pl.triangles[j];

				var v = m.vertices[pl.vertices[ti]];

				var p = v.position;
				var n = m.smooth ? v.normal : pl.normal;
				var t = m.uvs[pl.uvs[ti]];

				transport.length = 0;
				transport.push(p.x, p.y, p.z, n.x, n.y, n.z, t.x, t.y);
				b.set(null, c, transport);

				c++;
			}
		}


		b.update();

		if(!b.mesh) b.mesh = m;

		return b;
	}

	// Aliases
	m.V = m.addVertex;
	m.F = m.addFace;
	m.T = m.addUV;
};



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

	SQR.Mesh(buffer);

    return buffer.update();
};


/* --- --- [primitives/Plane.js] --- --- */

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

	var options = options || {};

	var w = w * 0.5;
	var h = h * 0.5;

	var wo = wo || 0;
	var ho = ho || 0;

	var wd = wd || 1;
	var hd = hd || 1;

	var wStart = -w + wo;
	var hStart = -h + ho;

	var wb = (w * 2) / wd;
	var hb = (h * 2) / hd;

	var i, j;
	var m = new SQR.Mesh();

	for (i = 0; i < wd+1; i++) {
		for (j = 0; j < hd+1; j++) {

			var bvStart = wStart + i * wb;
			var bhStart = hStart + j * hb;

			if (!options.zUp) {
				m.V(bvStart, 0, bhStart);
			} else {
				m.V(bvStart, bhStart, 0);
			}

			m.T(i/wd, j/hd);
		}
	}

	for (i = 0; i < wd; i++) {
		for (j = 0; j < hd; j++) {

			var bvStart = wStart + i * wb;
			var bvEnd = bvStart + wb;
			var bhStart = hStart + j * hb;
			var bhEnd = bhStart + hb;

			var a = (i+0) * (hd+1) + j;
			var b = (i+1) * (hd+1) + j;

			m.F(a, a+1, b, b+1).T(a, a+1, b, b+1);
		}
	}

	m.calculateNormals(options.smooth);
	if(options.flip) m.flip();

	return m.update();
}


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

















/* --- --- [primitives/Poly.js] --- --- */

SQR.Poly = function(mesh) {

	var p = this;
	p.mesh = mesh;
	p.triangles = [];
	
}

SQR.Poly.prototype.addVertices = function() {
	var p = this;

	p.size = arguments.length;

	if(p.size < 3) {
		throw '> SQR.Poly.addVertices > A poly needs at least 3 vertices.';
	}

	p.vertices = [];

	for(var i = 0; i < p.size; i++) {
		var id = arguments[i];
		p.mesh.vertices[id].addPoly(p);
		p.vertices.push(id);
	}

	// Attempt to form triangles for classic cases of tris and quads
	// Above 4 vertices however, user needs to provide own mapping but populating p.triangles
	if(p.size >= 3) p.triangles.push(0, 1, 2);
	if(p.size >= 4) p.triangles.push(2, 1, 3);

	return p;
}

SQR.Poly.prototype.addUV = function(a, b, c, d) {
	var p = this;
	p.uvs = [a, b, c];
	if(d) p.uvs.push(d);
	return p;
}

SQR.Poly.prototype.flip = function() {
	var p = this;
	var v = this.vertices;
	
	var tmp = v[1];
	v[1] = v[2];
	v[2] = tmp;

	if(v.normal) v.normal.neg();
	else if(p.normal) p.normal.neg();
	else console.log('> SQR.Poly.flip > please consider calculating normal first, then flipping');
}

SQR.Poly.prototype.calculateNormal = function() {

	var p = this;
	var v = this.vertices;
	var va = p.mesh.vertices;

	var t1 = SQR.V3.__tv1;
	var t2 = SQR.V3.__tv2;
	p.normal = p.normal || new SQR.V3();

	t1.sub(va[v[0]].position, va[v[1]].position);
	if(t1.isZero() && p.size > 3) t1.sub(va[v[0]].position, va[v[3]].position);
	t2.sub(va[v[2]].position, va[v[0]].position);

	p.normal.cross(t1, t2).norm();

	return p;
}

// Aliases
SQR.Poly.prototype.V = SQR.Poly.prototype.addVertices;
SQR.Poly.prototype.T = SQR.Poly.prototype.addUV;













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
					if(!d) d = options.shader.setUniform ? options.shader : SQR.Shader(options.shader);
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
				if(td.scale) arrayToObject(td.scale, t.scale);

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
SQR.Primitives.createSphere = function(radius, segmentsX, segmentsY, options) {

	var m = new SQR.Mesh();

	radius = radius || 50;
	segmentsX = Math.max(3, Math.floor(segmentsX) || 8);
	segmentsY = Math.max(3, Math.floor(segmentsY) || 6);
	options = options || {};

	var phiStart = 0;
	var phiLength = Math.PI * 2;
	var thetaStart = 0;
	var thetaLength = Math.PI;

	var x, y;

	for (y = 1; y <= segmentsY - 1; y ++) {

		for (x = 0; x < segmentsX; x ++) {

			var u = x / segmentsX;
			var v = y / segmentsY;

			var xp = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
			var yp = radius * Math.cos(thetaStart + v * thetaLength);
			var zp = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

			var i = m.V(xp, yp, zp);
			m.T(u, 1 - v);

		}
	}

	

	var northPole = m.V(0, radius, 0);
	var southPole = m.V(0, -radius, 0);	
	m.T(1, 1);
	m.T(0, 0);

	for (y = 0; y < segmentsY; y++) {

		var isn = y == 0;
		var iss = y == segmentsY - 1;

		for (x = 0; x < segmentsX; x++) {

			var y0 = y;
			var y1 = y + 1;

			var x0 = x;
			var x1 = (x + 1) % (segmentsX);

			var ta = y0 * segmentsX + x0 - segmentsX;
			if(isn) ta = northPole;

			var tb = y0 * segmentsX + x1 - segmentsX;
			if(isn) tb = northPole;

			var tc = y1 * segmentsX + x0 - segmentsX;
			if(iss) tc = southPole;

			var td = y1 * segmentsX + x1 - segmentsX;
			if(iss) td = southPole;

			if(isn) {
				m.F(ta, td, tc).T(ta, td, tc);
			} else if(iss) {
				m.F(ta, tb, td).T(ta, tb, td);
			} else {
				m.F(ta, tb, tc, td).T(ta, tb, tc, td);
			}

		}
	}

	m.calculateNormals(options.smooth);
	if(options.flip) m.flip();

	return m.update();
}












/* --- --- [primitives/Vertex.js] --- --- */

SQR.Vertex = function(x, y, z) {
	var v = this;
	v.position = new SQR.V3(x, y, z);
	v.normal = new SQR.V3();
	
}

SQR.Vertex.prototype.addPoly = function(p) {
	var v = this;
	v.polys = v.polys || [];
	v.polys.push(p);
}

SQR.Vertex.prototype.calculateNormal = function() {
	var v = this;
	v.normal.set();
	for(var i = 0, l = v.polys.length; i < l; i++) {
		v.normal.add(v.polys[i].normal);
	}
	v.normal.norm();
}

