/* --- --- [math/Bezier.js] --- --- */

/**
 *  @class
 *
 *  Represents a cubic bezier curve. All paramaters can be either {@link SQR.V3} or {@link SQR.V2}.
 *
 *  @param _p0 start position
 *  @param _c0 first control point
 *  @param _c1 last control point
 *  @param _c1 end position
 *
 */
SQR.Bezier = function(_p0, _c0, _c1, _p1) {

    var that = this;

    /**
     *  Start position. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.p0 = _p0;

    /**
     *  First control point. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.c0 = _c0;

    /**
     *  Second control point. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.c1 = _c1;

    /**
     *  End position. Can be either {@link SQR.V3} or {@link SQR.V2}.
     */
    this.p1 = _p1;

    var interpolatedValue, interpolatedVelocity, interpolatedMatrix;

    var pfunc = SQR.Interpolation.bezierPosition;
    var vfunc = SQR.Interpolation.bezierVelocity;

    /**
     *  Returns the velocity on a curve. 
     *  @param t interpolation value [0-1]
     *  @param v vector to write the value to. If omitted, returns a temporary value, that will be overwritten on next call so do not store this object.
     */
    this.velocityAt = function(t, v) {
        interpolatedVelocity = interpolatedVelocity || this.p0.clone().set();
        v = v || interpolatedVelocity;
        v.x = vfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = vfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z !== null && this.p0.z !== null) {
            v.z = vfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }

        return v;
    }

    /**
     *  Returns the position on a curve.
     *  @param t interpolation value [0-1]
     *  @param v vector to write the value to. If omitted, returns a temporary value, that will be overwritten on next call so do not store this object.
     */
    this.valueAt = function(t, v) {
        interpolatedValue = interpolatedValue || this.p0.clone().set();
        v = v || interpolatedValue;
        v.x = pfunc(t, this.p0.x, this.c0.x, this.c1.x, this.p1.x);
        v.y = pfunc(t, this.p0.y, this.c0.y, this.c1.y, this.p1.y);

        if(v.z !== null && this.p0.z !== null) {
            v.z = pfunc(t, this.p0.z, this.c0.z, this.c1.z, this.p1.z);
        }
        
        return v;
    }

    /** 
     *  Returns the transformation matrix that can be used to align an object to the curve at a given point.
     *  Not tested in 2D but shoud work fine.
     *  @param t interpolation value [0-1]
     *  @param m {@link SQR.Matrix44} to write the matrix to. If omitted, returns a temporary value, that will be overwritten on next call so do not store this object.
     */
    this.matrixAt = function(t, m) {
        interpolatedMatrix = interpolatedMatrix || new SQR.Matrix44();
        m = m || interpolatedMatrix;
        m.identity();

        var va = that.valueAt(t);
        var vc = that.velocityAt(t).norm();
        var vl = SQR.V3.__tv1.set().cross(vc, SQR.V3.up);//.norm();
        var vn = SQR.V3.__tv2.set().cross(vc, vl);//.norm()

        m.data[0] = vl.x, m.data[4] = vn.x, m.data[8] = vc.x;
        m.data[1] = vl.y, m.data[5] = vn.y, m.data[9] = vc.y;
        m.data[2] = vl.z, m.data[6] = vn.z, m.data[10] = vc.z;
        m.setTranslation(va.x, va.y, va.z);

        return m;
    }
}













/* --- --- [math/ConvexHull.js] --- --- */

SQR.ConvexHull = (function() {

	// based on algorithm from Chapter 1 in 
	// http://www.amazon.com/dp/3540779736/?tag=stackoverfl08-20

	// and code from 
	// http://blog.cedric.ws/draw-the-convex-hull-with-canvas-and-javascript
	// (which is basically the implementation of the algorithm explained in the book above)

	var upper = [], lower = [], hull = [];

	var sortXY = function(a, b) {
		if(a.x == b.x) return a.y - b.y;
		else return a.x - b.x;
	}

	var isRight = function(a, b, c){
		return ( 
			(c.x * a.y - c.y * a.x) - 
			(b.x * a.y - b.y * a.x) + 
			(b.x * c.y - b.y * c.x)) < 0;
	}

	var upperHull = function(p, u) {

		u.push(p[0]);
		u.push(p[1]);

		for(var i = 2, l = p.length; i < l; i++) {

			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3],
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	var lowerhull = function(p, u){

		u.push(p[p.length-1]);
		u.push(p[p.length-2]);

		for(var i = p.length-3; i >= 0; i--) {
			u.push(p[i]);

			while(u.length > 2 &&
				!isRight(
					u[u.length-3], 
					u[u.length-1],
					u[u.length-2]
				)
			) {
				u.splice(
					u.indexOf(u[u.length-2]), 
					1
				);
			}
		}

		return u;
	}

	return {
		compute: function(p, h) {

			if(!h) h = hull;

			upper.length = 0, lower.length = 0, h.length = 0;

			p.sort(sortXY);

			upperHull(p, upper);
			lowerhull(p, lower);

			h = h.concat(upper, lower);

			return h;
		}
	}

})();


/* 

Other links: 
http://www.travellermap.com/tmp/delaunay.js
https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
http://paulbourke.net/papers/triangulate/

*/










/* --- --- [math/Delaunay.js] --- --- */

/**
*  Based on: 
*  
*  http://paulbourke.net/papers/triangulate/
*  http://www.travellermap.com/tmp/delaunay.htm (original code)
*  https://github.com/ironwallaby/delaunay/blob/master/delaunay.js
*  http://www.amazon.com/Computational-Geometry-Applications-Mark-Berg/dp/3642096816
*/
SQR.Delaunay = (function() {

	var delaunay = {};

	var Edge = function(v0, v1) {
		this.v0 = v0;
		this.v1 = v1;
	}

	Edge.prototype.equals = function(other) {
		return (this.v0 === other.v0 && this.v1 === other.v1);
	};

	Edge.prototype.inverse = function() {
		return new Edge(this.v1, this.v0);
	};

	var createSuperTriangle = function(vertices) {
		// NOTE: There's a bit of a heuristic here. If the bounding triangle 
		// is too large and you see overflow/underflow errors. If it is too small 
		// you end up with a non-convex hull.

		var minx, miny, maxx, maxy;
		vertices.forEach(function(vertex) {
			if (minx === undefined || vertex.x < minx) { minx = vertex.x; }
			if (miny === undefined || vertex.y < miny) { miny = vertex.y; }
			if (maxx === undefined || vertex.x > maxx) { maxx = vertex.x; }
			if (maxy === undefined || vertex.y > maxy) { maxy = vertex.y; }
		});

		var dx = (maxx - minx) * 10;
		var dy = (maxy - miny) * 10;

		var stv0 = new SQR.V2(minx - dx, miny - dy * 3);
		var stv1 = new SQR.V2(minx - dx, maxy + dy);
		var stv2 = new SQR.V2(maxx + dx * 3, maxy + dy);

		return new SQR.Triangle(stv0, stv1, stv2);
	}

	function addVertex(vertex, triangles) {
		var edges = [];

		triangles = triangles.filter(function(triangle) {
			if (triangle.vertexInCircumcircle(vertex)) {
				edges.push(new Edge(triangle.v0, triangle.v1));
				edges.push(new Edge(triangle.v1, triangle.v2));
				edges.push(new Edge(triangle.v2, triangle.v0));
				return false;
			}

			return true;
		});

		edges = uniqueEdges(edges);

		edges.forEach(function(edge) {
			triangles.push(new SQR.Triangle(edge.v0, edge.v1, vertex));
		});

		return triangles;
	}

	var uniqueEdges = function(edges) {
		var uniqueEdges = [];

		for (var i = 0; i < edges.length; ++i) {
			var edge1 = edges[i];
			var unique = true;

			for (var j = 0; j < edges.length; ++j) {
				if (i === j) continue;
				var edge2 = edges[j];
				if (edge1.equals(edge2) || edge1.inverse().equals(edge2)) {
					unique = false;
					break;
				}
			}

			if (unique) uniqueEdges.push(edge1);
		}

		return uniqueEdges;
	}

	/**
	 *	Performs Delaunay triangulation.
	 *
	 *	@param vertices - a list of 2d vertices (can be SQR.V2, SQR.V3 or any object that has x and y properties)
	 *	@returns tirnalges - a list of SQR.Triangles
	 */
	delaunay.triangulate = function(vertices) {
		var triangles = [];

		var st = createSuperTriangle(vertices);

		triangles.push(st);

		vertices.forEach(function(vertex) {
			// NOTE: This is O(n^2) - can be optimized by sorting vertices
			// along the x-axis and only considering triangles that have 
			// potentially overlapping circumcircles
			triangles = addVertex(vertex, triangles);
		});

		// Remove triangles that shared edges with "supertriangle"
		triangles = triangles.filter(function(triangle) {
			return !(triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
			triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
			triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2);
		});

		return triangles;
	}

	return delaunay;

})();

/* --- --- [math/Interpolation.js] --- --- */

/**
 * @class
 *
 * A collection of interpolation functions.
 */
SQR.Interpolation = {

    /**
     *  Returns the position on a curve for a position (per axis)
     *  @param t interpolation value [0-1]
     *  @param p0 start position
     *  @param c0 first control point
     *  @param c1 second control point
     *  @param p1 end position
     */
    bezierPosition: function(t, p0, c0, c1, p1) {
        return p0 * (1 - t) * (1 - t) * (1 - t) +
            c0 * 3 * t * (1 - t) * (1 - t) +
            c1 * 3 * t * t * (1 - t) +
            p1 * t * t * t;
    },

    /**
     *  Returns the velocity on the curve for a position (per axis)
     *  @param t interpolation value [0-1]
     *  @param p0 start position
     *  @param c0 first control point
     *  @param c1 second control point
     *  @param p1 end position
     */
    bezierVelocity: function(t, p0, c0, c1, p1) {
        return (3 * c0 - 3 * p0)
            + 2 * (3 * p0 - 6 * c0 + 3 * c1) * t
            + 3 * (-p0 + 3 * c0 - 3 * c1 + p1) * t * t;
    },

    /**
     *  Linear interpolation a between two values
     *  @param e0 start value
     *  @param e1 end value
     *  @param t interpolation value [0-1]
     */
    linear: function(e0, e1, t) {
        if(t <= e0) return e0;
        if(t >= e1) return e1;

        t = (t - e0) / (e1 - e0);

        return e0 + (e1 - e0) * t;
    },
    
    /**
     *  Smoothstep interpolation a between two values
     *  @param e0 start value
     *  @param e1 end value
     *  @param t interpolation value [0-1]
     */
    smoothStep: function(e0, e1, t) {
        if(t <= e0) return e0;
        if(t >= e1) return e1;

        t = (t - e0) / (e1 - e0);

        return e0 + (e1 - e0) * (3 * t * t - 2 * t * t * t);
    },

    /**
     *  Quadratic ease in based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadIn: function (t) {
        return t * t;
    },

    /**
     *  Quadratic ease out based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadOut: function (t) {
        return t * (2 - t);
    },

    /**
     *  Quadratic ease in-out based on Penner equations
     *  @param t interpolation value [0-1]
     */
    quadInOut: function (t) {
        if (( t *= 2 ) < 1)
            return 0.5 * t * t;
        else
            return -0.5 * ( --t * ( t - 2 ) - 1 );
    }

};

/* --- --- [math/Matrix2D.js] --- --- */

/**
 * @class
 *
 * A matrix that implements 2D affine transformations.
 *
 * @todo Make it column major
 */
SQR.Matrix2D = function() {

    this.data = new Float32Array(9);

    var a, b, d, x, y;

    /**
     * Resets the matrix to identity values.
     */
    this.identity = function(d) {
        d = d || this.data;
        d[0] = 1,d[3] = 0,d[6] = 0;
        d[1] = 0,d[4] = 1,d[7] = 0;
        d[2] = 0,d[5] = 0,d[8] = 1;

        return this;
    }

    /**
     * Multiplies the vector by the matrix
     * @param v vector to multiply
     * @returns the same vector as passed in the parameter, multiplied by this matrix
     */
    this.transformVector = function(v) {
        d = this.data;
        x = v.x,y = v.y;
        v.x = d[0] * x + d[1] * y + d[2];
        v.y = d[3] * x + d[4] * y + d[5];
        return v;
    }

    /**
     *  Sets the translation values.
     *  @param tx x translation
     *  @param ty y translation
     *  @param m the matrix to set translation to, applies to this if ommited
     */
    this.setTranslation = function(tx, ty, m) {
        d = m || this.data;
        d[0] = 1,d[3] = 0,d[6] = tx;
        d[1] = 0,d[4] = 1,d[7] = ty;
        d[2] = 0,d[5] = 0,d[8] = 1;
        return this;
    }

    /**
     *  Returns the translation value as 2d vector.
     *  @param v {@link SQR.V2}, if ommited a new vector object is returned
     *  @returns a {@link SQR.V2} with translation values
     */
    this.getTranslation = function(v) {
        d = this.data;
        v = v || new SQR.V2();
        v.x = d[2];
        v.y = d[5];
        return v;
    }

    /**
     *  Sets the scale values.
     *  @param sx x scale
     *  @param sy y scale
     *  @param m the matrix to set scale to, applies to this if ommited
     */
    this.setScale = function(sx, sy, m) {
        d = m || this.data;
        d[0] = sx,d[3] = 0, d[6] = 0;
        d[1] = 0, d[4] = sy,d[7] = 0;
        d[2] = 0, d[5] = 0, d[8] = 1;
        return this;
    }

    this.setShear = function(sx, sy, m) {
        d = m || this.data;
        d[0] = 1, d[3] = sx,d[6] = 0;
        d[1] = sy,d[4] = 1, d[7] = 0;
        d[2] = 0, d[5] = 0, d[8] = 1;
        return this;
    }

    this.setRotation = function(a, m) {
        d = m || this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0,d[3] = -r1,d[6] = 0;
        d[1] = r1,d[4] = r0, d[7] = 0;
        d[2] = 0, d[5] = 0,  d[8] = 1;
        return this;
    }

    this.setTRS = function(tx, ty, a, sx, sy) {
        d = this.data;
        var r0 = Math.cos(a);
        var r1 = Math.sin(a);
        d[0] = r0 * sx,d[3] = -r1 * sy,d[6] = tx;
        d[1] = r1 * sx,d[4] = r0 * sy, d[7] = ty;
        d[2] = 0,      d[5] = 0,       d[8] = 1;
        return this;
    }

    this.translate = function(tx, ty) {
        this.identity(SQR.Matrix2D.__temp);
        this.setTranslation(tx, ty, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.rotate = function(a) {
        this.identity(SQR.Matrix2D.__temp);
        this.setRotation(a, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.scale = function(sx, sy) {
        this.identity(SQR.Matrix2D.__temp);
        this.setScale(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    this.shear = function(sx, sy) {
        this.identity(SQR.Matrix2D.__temp);
        this.setRotation(sx, sy, SQR.Matrix2D.__temp);
        return this.multiply(SQR.Matrix2D.__temp);
    }

    var a11, a12, a13, a21, a22, a23, a31, a32, a33;
    var b11, b12, b13, b21, b22, b23, b31, b32, b33;

    this.multiply = function(m) {
        a = this.data, b = m.data || m;

        a11 = a[0],a12 = a[3],a13 = a[6];
        a21 = a[1],a22 = a[4],a23 = a[7];
        a31 = a[2],a32 = a[5],a33 = a[8];

        b11 = b[0],b12 = b[3],b13 = b[6];
        b21 = b[1],b22 = b[4],b23 = b[7];
        b31 = b[2],b32 = b[5],b33 = b[8];

        a[0] = a11 * b11 + a12 * b21 + a13 * b31;
        a[3] = a11 * b12 + a12 * b22 + a13 * b32;
        a[6] = a11 * b13 + a12 * b23 + a13 * b33;

        a[1] = a21 * b11 + a22 * b21 + a23 * b31;
        a[4] = a21 * b12 + a22 * b22 + a23 * b32;
        a[7] = a21 * b13 + a22 * b23 + a23 * b33;

        //a[6] = a31 * b11 + a32 * b21 + a33 * b31;
        //a[7] = a31 * b12 + a32 * b22 + a33 * b32;
        //a[8] = a31 * b13 + a32 * b23 + a33 * b33;

        return this;
    }

    this.copyTo = function(m) {
        a = this.data,b = m.data || m;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return m;
    }

    this.copyFrom = function(m) {
        a = m.data || m,b = this.data;

        b[0] = a[0],b[1] = a[1],b[2] = a[2];
        b[3] = a[3],b[4] = a[4],b[5] = a[5];
        b[6] = a[6],b[7] = a[7],b[8] = a[8];

        return this;
    }

    this.identity();
}

SQR.Matrix2D.__temp = new Float32Array(9);
















/* --- --- [math/Matrix33.js] --- --- */

/**
 * @class
 *
 * A 3x3 matrix for used to hold rotations and normal matrices
 */
SQR.Matrix33 = function() {

    this.data = new Float32Array(9);

    this.identity = function() {
        var d = this.data;
        d[0] = 1,d[3] = 0,d[6] = 0;
        d[1] = 0,d[4] = 1,d[7] = 0;
        d[2] = 0,d[5] = 0,d[8] = 1;
        return this;
    }

    this.transformVector = function (v, pv) {
        var d = this.data;
        var x = v.x, y = v.y, z = v.z;
        pv = pv || v;

        pv.x = d[0] * x + d[3] * y + d[6] * z;
        pv.y = d[1] * x + d[4] * y + d[7] * z;
        pv.z = d[2] * x + d[5] * y + d[8] * z;

        return pv;
    }

    this.determinant = function() {
        var d = this.data;

        return d[0] * (d[4] * d[8] - d[7] * d[5]) +
               d[3] * (d[7] * d[2] - d[1] * d[8]) +
               d[6] * (d[1] * d[5] - d[4] * d[2]);
    }

    this.inverse = function(m) {
        var d = this.data;
        m = m || this.data;

        var a00 = d[0], a01 = d[1], a02 = d[2],
            a10 = d[3], a11 = d[4], a12 = d[5],
            a20 = d[6], a21 = d[7], a22 = d[8],

            b01 = a22 * a11 - a12 * a21,
            b11 = -a22 * a10 + a12 * a20,
            b21 = a21 * a10 - a11 * a20,

            d = a00 * b01 + a01 * b11 + a02 * b21,
            id;

        if (!d) {
            console.warn("Attempt to inverse a singular matrix33. ", this.data);
            return m;
        }
        
        id = 1 / d;

        m[0] = b01 * id;
        m[1] = (-a22 * a01 + a02 * a21) * id;
        m[2] = (a12 * a01 - a02 * a11) * id;
        m[3] = b11 * id;
        m[4] = (a22 * a00 - a02 * a20) * id;
        m[5] = (-a12 * a00 + a02 * a10) * id;
        m[6] = b21 * id;
        m[7] = (-a21 * a00 + a01 * a20) * id;
        m[8] = (a11 * a00 - a01 * a10) * id;

        return m;

    }

    this.transpose = function() {
        var d = this.data;

        var d0 = d[0], d3 = d[3], d6 = d[6],
            d1 = d[1], d4 = d[4], d7 = d[7],
            d2 = d[2], d5 = d[5], d8 = d[8];

        d[0] = d0;
        d[1] = d3;
        d[2] = d6;

        d[3] = d1;
        d[4] = d4;
        d[5] = d7;

        d[6] = d2;
        d[7] = d5;
        d[8] = d8;
    }

}

/* --- --- [math/Matrix44.js] --- --- */

/**
 * @class
 *
 * A multi-purpose 4x4 matrix.
 */
SQR.Matrix44 = function() {

    this.data = new Float32Array(16);

    this.identity = function(m) {
        var d = m || this.data;
        d[0] = 1,d[4] = 0,d[8] = 0,d[12] = 0;
        d[1] = 0,d[5] = 1,d[9] = 0,d[13] = 0;
        d[2] = 0,d[6] = 0,d[10] = 1,d[14] = 0;
        d[3] = 0,d[7] = 0,d[11] = 0,d[15] = 1;
        return this;
    }

    this.transformVector = function (v, pv) {
        var d = this.data;
        var x = v.x, y = v.y, z = v.z, w = v.w;
        pv = pv || v;
        
        pv.x = d[0] * x + d[4] * y + d[8] * z + d[12] * w;
        pv.y = d[1] * x + d[5] * y + d[9] * z + d[13] * w;
        pv.z = d[2] * x + d[6] * y + d[10] * z + d[14] * w;
        // pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

        return pv;
    }

    this.multiply = function(m) {
        var a = this.data, b = m.data || m;

        var a00, a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15;
        var b00, b01, b02, b03, b04, b05, b06, b07, b08, b09, b10, b11, b12, b13, b14, b15;

        a00 = a[0],a01 = a[1],a02 = a[2],a03 = a[3];
        a04 = a[4],a05 = a[5],a06 = a[6],a07 = a[7];
        a08 = a[8],a09 = a[9],a10 = a[10],a11 = a[11];
        a12 = a[12],a13 = a[13],a14 = a[14],a15 = a[15];

        b00 = b[0],b01 = b[1],b02 = b[2],b03 = b[3];
        b04 = b[4],b05 = b[5],b06 = b[6],b07 = b[7];
        b08 = b[8],b09 = b[9],b10 = b[10],b11 = b[11];
        b12 = b[12],b13 = b[13],b14 = b[14],b15 = b[15];

        a[0] = a00 * b00 + a04 * b01 + a08 * b02 + a12 * b03;
        a[1] = a01 * b00 + a05 * b01 + a09 * b02 + a13 * b03;
        a[2] = a02 * b00 + a06 * b01 + a10 * b02 + a14 * b03;
        a[3] = a03 * b00 + a07 * b01 + a11 * b02 + a15 * b03;

        a[4] = a00 * b04 + a04 * b05 + a08 * b06 + a12 * b07;
        a[5] = a01 * b04 + a05 * b05 + a09 * b06 + a13 * b07;
        a[6] = a02 * b04 + a06 * b05 + a10 * b06 + a14 * b07;
        a[7] = a03 * b04 + a07 * b05 + a11 * b06 + a15 * b07;

        a[8] = a00 * b08 + a04 * b09 + a08 * b10 + a12 * b11;
        a[9] = a01 * b08 + a05 * b09 + a09 * b10 + a13 * b11;
        a[10] = a02 * b08 + a06 * b09 + a10 * b10 + a14 * b11;
        a[11] = a03 * b08 + a07 * b09 + a11 * b10 + a15 * b11;

        a[12] = a00 * b12 + a04 * b13 + a08 * b14 + a12 * b15;
        a[13] = a01 * b12 + a05 * b13 + a09 * b14 + a13 * b15;
        a[14] = a02 * b12 + a06 * b13 + a10 * b14 + a14 * b15;
        a[15] = a03 * b12 + a07 * b13 + a11 * b14 + a15 * b15;

        return this;
    }

    this.setTQS = function(tx, ty, tz, qw, qx, qy, qz, sx, sy, sz, m) {

        var d = m || this.data;
        this.identity(m);

        var sqx = qx * qx;
        var sqy = qy * qy;
        var sqz = qz * qz;

        d[0] = (1 - 2 * sqy - 2 * sqz) * sx;
        d[1] = (2 * qx * qy - 2 * qz * qw) * sx;
        d[2] = (2 * qx * qz + 2 * qy * qw) * sx;

        d[4] = (2 * qx * qy + 2 * qz * qw) * sy;
        d[5] = (1 - 2 * sqx - 2 * sqz) * sy;
        d[6] = (2 * qy * qz - 2 * qx * qw) * sy;

        d[8] = (2 * qx * qz - 2 * qy * qw) * sz;
        d[9] = (2 * qy * qz + 2 * qx * qw) * sz;
        d[10] = (1 - 2 * sqx - 2 * sqy) * sz;

        d[12] = tx;
        d[13] = ty;
        d[14] = tz;

        return m || this;
    }

    this.setTRS = function(tx, ty, tz, rx, ry, rz, sx, sy, sz, m) {

        var d = m || this.data;
        this.identity(m);

        var six = Math.sin(rx), cox = Math.cos(rx), siy = Math.sin(ry), coy = Math.cos(ry), siz = Math.sin(rz), coz = Math.cos(rz);

        // fliping this part changes from left handed to right handed (I think)
        d[0] = (coy * coz + siy * six * siz) * sx;
        d[1] = (-coy * siz + siy * six * coz) * sx;
        d[2] = siy * cox * sx;

        d[4] = siz * cox * sy;
        d[5] = coz * cox * sy;
        d[6] = -six * sy;

        d[8] = (-siy * coz + coy * six * siz) * sz;
        d[9] = (siz * siy + coy * six * coz) * sz;
        d[10] = coy * cox * sz;

        d[12] = tx;
        d[13] = ty;
        d[14] = tz;

        return m || this;
    }

    this.setScale = function(sx, sy, sz, m) {
        var d = m || this.data;
        d[0] = sx,d[5] = sy,d[10] = sz;
        return m || this;
    }

    this.setTranslation = function(tx, ty, tz, m) {
        var d = m || this.data;
        d[12] = tx, d[13] = ty, d[14] = tz;
        return m || this;
    }

    this.setRotation = function(rx, ry, rz, m) {
        var d = m || this.data;
        var six = Math.sin(rx), cox = Math.cos(rx), 
            siy = Math.sin(ry), coy = Math.cos(ry), 
            siz = Math.sin(rz), coz = Math.cos(rz);

        d[0] = coy * coz + siy * six * siz;
        d[1] = -coy * siz + siy * six * coz;
        d[2] = siy * cox;

        d[4] = siz * cox;
        d[5] = coz * cox;
        d[6] = -six;

        d[8] = -siy * coz + coy * six * siz;
        d[9] = siz * siy + coy * six * coz;
        d[10] = coy * cox;

        return m || this;
    }

    this.translate = function(tx, ty, tz) {
        this.identity(SQR.Matrix44.__temp);
        this.setTranslation(tx, ty, tz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.rotate = function(rx, ry, rz) {
        this.identity(SQR.Matrix44.__temp);
        this.setRotation(rx, ry, rz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.scale = function(sx, sy, sz) {
        this.identity(SQR.Matrix44.__temp);
        this.setScale(sx, sy, sz, SQR.Matrix44.__temp);
        return this.multiply(SQR.Matrix44.__temp);
    }

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for (var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.copyRotationTo = function(m) {
        var a = this.data, b = m.data || m;

        b[0] = a[0];
        b[1] = a[1];
        b[2] = a[2];

        b[3] = a[4];
        b[4] = a[5];
        b[5] = a[6];

        b[6] = a[8];
        b[7] = a[9];
        b[8] = a[10];

        return m;
    }

    this.extractPosition = function(v) {
        var d = this.data;
        v.set(d[12], d[13], d[14]);
        return v;
    }

    this.determinant = function() {
        var d = this.data;

        return d[0] * (d[5] * d[10] - d[9] * d[6]) +
            d[4] * (d[9] * d[2] - d[1] * d[10]) +
            d[8] * (d[1] * d[6] - d[5] * d[2]);
    }

    this.inverse = function(m) {
        var a = this.data;
        var d = (m) ? m.data || m : this.data;

        var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
            a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
            a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
            a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) { 
            return null; 
        }
        det = 1.0 / det;

        d[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        d[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        d[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        d[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        d[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        d[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        d[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        d[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        d[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        d[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        d[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        d[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        d[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        d[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        d[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        d[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return m;
    };

    // gl-Matrix.js
    this.inverseMat3 = function(m) {
        var d = this.data;
        var a = m.data;
        var det = this.determinant();

        if (Math.abs(det) < 0.0001) {
            console.warn("Attempt to inverse a singular matrix44. ", this.data);
            console.trace();
            return m;
        }

        var d0 = d[0], d4 = d[4], d8 = d[8],   d12 = d[12],
            d1 = d[1], d5 = d[5], d9 = d[9],   d13 = d[13],
            d2 = d[2], d6 = d[6], d10 = d[10], d14 = d[14];

        det = 1 / det;

        // To make a NormalMatrix - needs to be transposed
        a[0] = (d5 * d10 - d9 * d6) * det;
        a[1] = (d8 * d6 - d4 * d10) * det;
        a[2] = (d4 * d9 - d8 * d5) * det;

        a[3] = (d9 * d2 - d1 * d10) * det;
        a[4] = (d0 * d10 - d8 * d2) * det;
        a[5] = (d8 * d1 - d0 * d9) * det;

        a[6] = (d1 * d6 - d5 * d2) * det;
        a[7] = (d4 * d2 - d0 * d6) * det;
        a[8] = (d0 * d5 - d4 * d1) * det;
        // m.transpose();

        // To make a NormalMatrix - doesn't need to be transposed
        // a[0] = (d5 * d10 - d9 * d6) * det;
        // a[3] = (d8 * d6 - d4 * d10) * det;
        // a[6] = (d4 * d9 - d8 * d5) * det;

        // a[1] = (d9 * d2 - d1 * d10) * det;
        // a[4] = (d0 * d10 - d8 * d2) * det;
        // a[7] = (d8 * d1 - d0 * d9) * det;

        // a[2] = (d1 * d6 - d5 * d2) * det;
        // a[5] = (d4 * d2 - d0 * d6) * det;
        // a[8] = (d0 * d5 - d4 * d1) * det;

        

        return m;
    }

    this.transpose = function(m) {
        var d = this.data;
        var a = (m) ? m.data || m : this.data;

        var d0 = d[0], d4 = d[4], d8 = d[8],
            d1 = d[1], d5 = d[5], d9 = d[9],
            d2 = d[2], d6 = d[6], d10 = d[10];

        a[0] = d0;
        a[1] = d4;
        a[2] = d8;

        a[4] = d1;
        a[5] = d5;
        a[6] = d9;

        a[8] = d2;
        a[9] = d6;
        a[10] = d10;
    }

    this.lookAt = function (target, up) {
        var d = this.data;
        var x = SQR.V3.__tv1;
        var y = SQR.V3.__tv2;
        var z = SQR.V3.__tv3;

        up = up || SQR.V3.up;

        // console.log(target, up);

        z.set(d[12], d[13], d[14]);
        z.sub(z, target).norm();
        if (z.magsq() === 0) z.z = 1;

        x.cross(up, z).norm();
        if (x.magsq() === 0) {
            z.x += 0.0001;
            x.cross(up, z).norm();
        }

        y.cross(z, x);

        d[0] = x.x, d[4] = y.x, d[8] = z.x;
        d[1] = x.y, d[5] = y.y, d[9] = z.y;
        d[2] = x.z, d[6] = y.z, d[10] = z.z;

        return this;
    }

    this.identity();
}

SQR.Matrix44.__temp = new Float32Array(16);












/* --- --- [math/ProjectionMatrix.js] --- --- */

/**
 * @class 
 *
 * The 4x4 matrix is used mostly for perspective and orthographic projection.
 */
SQR.ProjectionMatrix = function() {
    if (typeof Float32Array == 'undefined') Float32Array = Array;
    this.data = new Float32Array(16);

    this.copyTo = function(m) {
        var a = this.data, b = m.data || m;
        for (var i = 0; i < 16; i++) b[i] = a[i];
        return m;
    }

    this.identity();
}

/**
 *  Resets the matrix to identity
 */
SQR.ProjectionMatrix.prototype.identity = function() {
    var m = this.data;
    m[0] = 1,m[1] = 0,m[2] = 0,m[3] = 0;
    m[4] = 0,m[5] = 1,m[6] = 0,m[7] = 0;
    m[8] = 0,m[9] = 0,m[10] = 1,m[11] = 0;
    m[12] = 0,m[13] = 0,m[14] = 0,m[15] = 1;
    return this;
}

/**
 *  Returns an orthographic projection matrix that is set in screen coordinates.
 */
SQR.ProjectionMatrix.prototype.screenPixels2d = function() {
    this.orthographic(0, window.innerWidth, 0, window.innerHeight, -1, 1);
    return this;
}

/**
 *  Returns an orthographic projection matrix.
 */
SQR.ProjectionMatrix.prototype.orthographic = function(left, right, top, bottom, near, far) {

    var te = this.data;

     /**
     *  @property the near clipping
     *  @readonly
     */
    this.near = near;

    /**
     *  @property the far clipping
     *  @readonly
     */
    this.far = far;
    
    var w = right - left;
    var h = top - bottom;
    var p = far - near;

    var x = ( right + left ) / w;
    var y = ( top + bottom ) / h;
    var z = ( far + near ) / p;

    te[0] = 2 / w;    te[4] = 0;        te[8] = 0;        te[12] = -x;
    te[1] = 0;        te[5] = 2 / h;    te[9] = 0;        te[13] = -y;
    te[2] = 0;        te[6] = 0;        te[10] = -2/p;    te[14] = -z;
    te[3] = 0;        te[7] = 0;        te[11] = 0;       te[15] = 1;
    return this;
}

/**
 *  Returns a perspective projection matrix.
 */
SQR.ProjectionMatrix.prototype.perspective = function(fov, aspect, near, far) {

    /**
     *  @property the near clipping
     *  @readonly
     */
    this.near = near;

    /**
     *  @property the far clipping
     *  @readonly
     */
    this.far = far;

    var m = this.data;
    var t = near * Math.tan(fov * Math.PI / 360);
    var n = far - near;

    m[0] = near / (t * aspect);
    m[4] = 0;
    m[8] = 0;
    m[12] = 0;

    m[1] = 0;
    m[5] = near / t;
    m[9] = 0;
    m[13] = 0;

    m[2] = 0;
    m[6] = 0;
    m[10] = -(far + near) / n;
    m[14] = -(2 * far * near) / n;

    m[3] = 0;
    m[7] = 0;
    m[11] = -1;
    m[15] = 0;

    return this;
}

/**
 *  Returns vector mautipled by this matrix
 */
SQR.ProjectionMatrix.prototype.transformVector = function(v, pv) {
    var x = v.x, y = v.y, z = v.z, w = v.w;
    var m = this.data;
    pv = pv || v;

    pv.x = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    pv.y = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    pv.z = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
//  pv.w = d[3] * x + d[7] * y + d[11] * z + d[15] * w;

    return pv;
}

/**
 *  Inverses the matrix. Useful for projecting screen coordinates back in to 3d space.
 */
SQR.ProjectionMatrix.prototype.inverse = function (m) {
    var mat = this.data;
    m = m || this.data;

    var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3],
        a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7],
        a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11],
        a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),
        invDet;

    // Calculate the determinant
    if (!d) {
        return null;
    }
    invDet = 1 / d;

    m[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    m[1] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;
    m[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    m[3] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;

    m[4] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;
    m[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    m[6] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;
    m[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;

    m[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    m[9] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;
    m[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    m[11] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;

    m[12] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;
    m[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    m[14] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;
    m[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return m;
};

/* --- --- [math/Quaternion.js] --- --- */

/**
 *  @class
 *
 *  Represents a quaternion with optionally setting the values directly.
 *
 *  Just as a reminder, this is what the values represent:
 */
SQR.Quaternion = function(x, y, z, w) {
    this.set(w, x, y, z);
}

/**
 *  Set value of the Quaternion directly.
 */
SQR.Quaternion.prototype.set = function(x, y, z, w) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
}

SQR.Quaternion.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return this;
}

/**
 *  Copy the values from another quaternion.
 *  @param q the quaternion to copy values from
 */
SQR.Quaternion.prototype.copyFrom = function(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
}

/**
 *  Resets the quaternion values to identity.
 */
SQR.Quaternion.prototype.identity = function() {
    this.set();
    return this;
}

/**
 * Multiplies rq (or this if no rq) by q
 * @param q
 * @param rq if not defined this is multiplied by q
 */
SQR.Quaternion.prototype.mul = function(q, rq) {
    rq = rq || this;

    var w = (rq.w * q.w - rq.x * q.x - rq.y * q.y - rq.z * q.z);
    var x = (rq.w * q.x + rq.x * q.w + rq.y * q.z - rq.z * q.y);
    var y = (rq.w * q.y - rq.x * q.z + rq.y * q.w + rq.z * q.x);
    var z = (rq.w * q.z + rq.x * q.y - rq.y * q.x + rq.z * q.w);

    rq.set(x, y, z, w);

    rq.normalize();

    return rq;
}

/**
 *  Sets the quaternion to point in the given direction.
 *  @param _dir the direction to look at
 *  @param _up the up vector
 */
SQR.Quaternion.prototype.lookAt = function(_dir, _up) {

    var dir = SQR.Quaternion.__tv1;
    var right = SQR.Quaternion.__tv2;
    var up = SQR.Quaternion.__tv3;

    _dir.copyTo(dir);
    _up.copyTo(up);

    dir.norm();

    // If direction is back, the returned quaternion is flipped. Not sure why, but that fixes it.
    if(dir.z == -1) {
        dir.x = 0.0001;
        dir.norm();
    }

    // Probably should do the orthonormalization but not sure how that works :)
    // tangent.sub(up, forward.mul(SQR.V3.dot(forward, up))).norm();
    right.cross(up, dir);
    up.cross(dir, right);

    this.w = Math.sqrt(1 + right.x + up.y + dir.z) * 0.5;
    var rc = 4 * this.w;
    this.x = (dir.y - up.z) / rc;
    this.y = (right.z - dir.x) / rc;
    this.z = (up.x - right.y) / rc;

    this.normalize();

    return this;
}

/**
 *  Creates a quaternion out of an angle axis representation.
 *  @param a angle in radians
 *  @param x x component of the axis
 *  @param y y component of the axis
 *  @param z z component of the axis
 */
SQR.Quaternion.prototype.fromAngleAxis = function(a, x, y, z) {
    var s = Math.sin(a / 2);
    this.x = x * s;
    this.y = y * s;
    this.z = z * s;
    this.w = Math.cos(a / 2);
}

/**
 *  Returns the magniture of the quaternion.
 */
SQR.Quaternion.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
}

/**
 *  Normalizes the quaternion.
 */
SQR.Quaternion.prototype.normalize = function() {
    var n = this.mag();
    this.x /= n;
    this.y /= n;
    this.z /= n;
    this.w /= n;
}

/**
 *  That method doesn't do anything for now. Check {SQR.Matrix44.TQS()} to see how to turn a Quanternion into a matrix representation.
 *
 *  @todo Implement (or not... not sure how much this is needed)
 */
SQR.Quaternion.prototype.toMatrix = function(m) {
    throw "SQR.Quaternion.toMatrix() is not implemented. Check SQR.Matrix44.TQS()"; 
}

/**
 *  Returns a spherical linear interpolation between two quaternions.
 *  @param qa first quaternion
 *  @param qb second quaternion
 *  @param t interpolation value [0-1]
 *  @param qr the quaterion to store the results in and return. If omitted results are returned in a new quaternion object.
 */
SQR.Quaternion.slerp = function(qb, qa, t, qr) {
    qr = qr || new SQR.Quaternion();

    var cha = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;
    var ha = Math.acos(cha);
    var sha = Math.sqrt(1 - cha * cha);
    var ra = Math.sin((1 - t) * ha) / sha;
    var rb = Math.sin(t * ha) / sha;

    if (Math.abs(cha) >= 1) {
        // If angle is 0 (i.e cos(a) = 1) just
        // return the first quaternion
        ra = 1;
        rb = 0;
    } else if (Math.abs(sha) < 0.001) {
        // If angle is 180 deg (i.e. sin(a) = 0) there is
        // an infinite amount of possible rotations between those 2
        ra = 0.5;
        rb = 0.5;
    }

    qr.w = (qa.w * ra + qb.w * rb);
    qr.x = (qa.x * ra + qb.x * rb);
    qr.y = (qa.y * ra + qb.y * rb);
    qr.z = (qa.z * ra + qb.z * rb);
    return qr;
}

SQR.Quaternion.prototype.slerp = function(qa, qb, t) {
    SQR.Quaternion.slerp(qa, qb, t, this);
}

SQR.Quaternion.__tv1 = new SQR.Quaternion();
SQR.Quaternion.__tv2 = new SQR.Quaternion();
SQR.Quaternion.__tv3 = new SQR.Quaternion();
















/* --- --- [math/Spline.js] --- --- */

SQR.Spline = function() {

	var points = [];
	var segments = [];
	var controlPoints = [];

	var s = {};

	var _tv1, _tv2;

	var getControlPoints = function(point, previous, next, c1, c2, smoothness) {
		var vab = _tv1.sub(point, previous).neg();
		var vcb = _tv2.sub(point, next);
		var d = (smoothness > 1) ? smoothness : smoothness * Math.min(vab.mag(), vcb.mag());
		c1.set().add(vab, vcb).norm().mul(d);
		c2.copyFrom(c1).neg();
		c1.add(c1, point);
		c2.add(c2, point);
	}

	s.addSegment = function(p) {
		var v;

		if(p.x) {
			v = p;
		} else {
			var a = arguments, l = a.length;
			if(l == 2) v = new SQR.V2(a[0], a[1]);
			else if(l == 3) v = new SQR.V3(a[0], a[1], a[2]);
		}

		segments.push(v);
		controlPoints.push(v.clone(), v.clone());

		if(!_tv1) {
			_tv1 = segments[0].clone();
			_tv2 = segments[0].clone();
		}

		return s;
	}

	s.create = function(smoothness, close) {

		if(segments.length < 2) return segments;

		smoothness = (smoothness !== null) ? smoothness : 0.5;
		points.length = 0;
		var firstPoint, firstControlPoint;

		var sg = segments, cp = controlPoints, sl = segments.length;
		
		for(var i = 0; i < sl; i++) {
			var si = sg[i];
			var c1 = cp[i * 2].set();
			var c2 = cp[i * 2 + 1].set();

			var a = (i == 0) ? sg[sl-1] : sg[i-1];
			var b = (i == sl-1) ? sg[0] : sg[i+1];

			getControlPoints(si, a, b, c1, c2, smoothness);
			cp.push(c1, c2);
		}

		for(var i = 0; i < sl-1; i++) {
			var a = sg[i];
			var b = (i == sl-1) ? sg[0] : sg[i+1];

			var c1 = (i == 0 && !close) ? a : cp[i * 2 + 1];
			var c2 = (i == sl-2 && !close) ? b : cp[i * 2 + 2];

			var c = new SQR.Bezier(a, c1, c2, b);
			points.push(c);
		}

		if(close) {
			var c = new SQR.Bezier(sg[sl-1], cp[(sl-1)*2+1], cp[0], sg[0]);
			points.push(c);
		}

		return s;
	}

	s.valueAt = function(t, v) {
		if(t == 1) t = 0.999999;
		t = t % 1;
		var tf = t * points.length;
		return points[tf | 0].valueAt(tf % 1, v);
	}

	s.velocityAt = function(t, v) {
		if(t == 1) t = 0.999999;
		t = t % 1;
		var tf = t * points.length;
		return points[tf | 0].velocityAt(tf % 1, v);
	}

	s.matrixAt = function(t, m) {
		if(t == 0) t = SQR.EPSILON;
		if(t == 1) t = 1 - SQR.EPSILON;
		t = t % 1;
		var tf = t * points.length;
		return points[tf | 0].matrixAt(tf % 1, m);
	}

	Object.defineProperty(s, 'segments', {
		get: function() { 
			return segments; 
		}
	});

	Object.defineProperty(s, 'points', {
		get: function() { 
			return points; 
		}
	});

	return s

}

/* --- --- [math/Triangle.js] --- --- */

SQR.Triangle = function(v0, v1, v2) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

	this.calculateCentroid = function() {
		this.centroid = new SQR.V2();
		this.centroid.x = (this.v0.x + this.v1.x + this.v2.x) / 3;
		this.centroid.y = (this.v0.y + this.v1.y + this.v2.y) / 3;
	}

	// http://jwilson.coe.uga.edu/emat6680/dunbar/assignment4/assignment4_kd.htm
	this.calculateCircumCircle = function() {

		// From: http://www.exaflop.org/docs/cgafaq/cga1.html
		var A = this.v1.x - this.v0.x;
		var B = this.v1.y - this.v0.y;
		var C = this.v2.x - this.v0.x;
		var D = this.v2.y - this.v0.y;

		var E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y);
		var F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y);

		var G = 2.0 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x));

		var dx, dy;

		if (Math.abs(G) < SQR.EPSILON) {
			// Collinear - find extremes and use the midpoint
			var minx = Math.min(this.v0.x, this.v1.x, this.v2.x);
			var miny = Math.min(this.v0.y, this.v1.y, this.v2.y);
			var maxx = Math.max(this.v0.x, this.v1.x, this.v2.x);
			var maxy = Math.max(this.v0.y, this.v1.y, this.v2.y);

			this.circumCenter = new SQR.V2((minx + maxx) / 2, (miny + maxy) / 2);

			dx = this.circumCenter.x - minx;
			dy = this.circumCenter.y - miny;
		} else {
			var cx = (D * E - B * F) / G;
			var cy = (A * F - C * E) / G;

			this.circumCenter = new SQR.V2(cx, cy);

			dx = this.circumCenter.x - this.v0.x;
			dy = this.circumCenter.y - this.v0.y;
		}

		this.circumRadiusSq = dx * dx + dy * dy;
		this.circumRadius = Math.sqrt(this.circumRadiusSq);
	}

	this.vertexInCircumcircle = function(v) {

		if(!this.circumCenter) this.calculateCircumCircle();

		var dx = this.circumCenter.x - v.x;
		var dy = this.circumCenter.y - v.y;
		var sq = dx * dx + dy * dy;
		return (sq <= this.circumRadiusSq);

	}

};

/* --- --- [math/Vector2.js] --- --- */

SQR.V2 = function(x, y) {
    this.set(x, y);
    this.size = 2;
}

SQR.V2.prototype.set = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    return this;
}

SQR.V2.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    return p;
}

SQR.V2.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    return this;
}

SQR.V2.prototype.clone = function() {
    return new SQR.V2(this.x, this.y);
}

SQR.V2.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y;
};

SQR.V2.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

SQR.V2.prototype.isZero = function() {
    return this.x == 0 && this.y == 0;
};

SQR.V2.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    return this;
}

SQR.V2.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
}

SQR.V2.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m);
    return this;
}

/**
 * a.add(a, b).add(a, c) -> a + b + c
 *
 * @param a
 * @param b
 */
SQR.V2.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
}

/**
 * a.sub(b, a) ->  a = from a to b
 *
 * @param a
 * @param b
 */
SQR.V2.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
}

SQR.V2.prototype.lerp = function(a, b, t) {
    this.x = a.x + (b.x - a.x) * t;
    this.y = a.y + (b.y - a.y) * t;
    return this;
}

SQR.V2.dot = function(a, b) {
    return (a.x * b.x + a.y * b.y)
}

SQR.V2.prototype.perp = function() {
    this.set(this.y, -this.x);
    return this;
}

SQR.V2.prototype.toUniform = function() {
    return toArray();
}

SQR.V2.prototype.toArray = function() {
    if(!this.array) this.array = new Float32Array(2);
    this.array[0] = this.x;
    this.array[1] = this.y;
    return this.array;
}

/* --- --- [math/Vector3.js] --- --- */

/**
 * @class
 *
 * A 3-dimensional vector
 *
 */
SQR.V3 = function(x, y, z, w, i) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    this.size = 3;
}

SQR.V3.prototype.set = function(x, y, z, w) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 1;
    return this;
}

SQR.V3.prototype.copyTo = function(p) {
    p.x = this.x;
    p.y = this.y;
    p.z = this.z;
    p.w = this.w;
    return p;
}

SQR.V3.prototype.copyFrom = function(p) {
    this.x = p.x;
    this.y = p.y;
    this.z = p.z || 0; // in case p is SQR.V2
    this.w = (p.w !== undefined) ? p.w : 1;
    return this;
}

SQR.V3.prototype.clone = function() {
    return new SQR.V3(this.x, this.y, this.z);
}

SQR.V3.prototype.magsq = function() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
};

SQR.V3.prototype.mag = function() {
    return Math.sqrt(this.magsq());
};

SQR.V3.prototype.isZero = function() {
    return this.x == 0 && this.y == 0 && this.z == 0;
};

SQR.V3.prototype.mul = function(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
}

SQR.V3.prototype.neg = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
}

SQR.V3.prototype.norm = function() {
    var m = 1 / this.mag();
    this.set(this.x * m, this.y * m, this.z * m);
    return this;
}

/**
 * a.add(a, b).add(a, c) -> a + b + c
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.add = function(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    this.z = a.z + b.z;
    return this;
}

/**
 * a.sub(b, a) ->  a = from a to b
 *
 * @param a
 * @param b
 */
SQR.V3.prototype.sub = function(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
}

SQR.V3.prototype.lerp = function(a, b, t) {
    this.x = a.x + (b.x - a.x) * t;
    this.y = a.y + (b.y - a.y) * t;
    this.z = a.z + (b.z - a.z) * t;
    return this;
}

SQR.V3.prototype.random = function() {
    this.x = Math.random() * 2 - 1;
    this.y = Math.random() * 2 - 1;
    this.z = Math.random() * 2 - 1;
    return this;
}

SQR.V3.dot = function(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

SQR.V3.prototype.cross = function(a, b) {
    var x = a.y * b.z - a.z * b.y;
    var y = a.z * b.x - a.x * b.z;
    var z = a.x * b.y - a.y * b.x;
    this.set(x, y, z, this.w);
    return this;
}

SQR.V3.prototype.toUniform = function() {
    return this.toArray();
}

SQR.V3.prototype.toArray = function() {
    if(!this.array) this.array = new Float32Array(3);
    this.array[0] = this.x;
    this.array[1] = this.y;
    this.array[2] = this.z; 
    return this.array;
}

/**
 *  Assuming the vector was projected using the SQR.ProjectionMatrix, use this
 *  to calculate it's screen space. (useful for software rendering, ex. on canvas 2d)
 */
SQR.V3.prototype.toScreenSpace = function(w, h) {
    w = w || window.innerWidth;
    h = h || window.innerHeight;
    this.x = (this.x / this.z) * w/2 + w/2;
    this.y = (this.y / this.z) * h/2 + h/2;
}

/**
 *  Use this for caculating per-vertex normals
 */
SQR.V3.prototype.addNormal = function(_n) {

    if(!this.normal) {
        this.normal = new SQR.V3();
    }

    this.normal.add(this.normal, _n);
}

SQR.V3.prototype.resetNormal = function(_n) {
    if(this.normal) this.normal.set();
}


SQR.V3.up = new SQR.V3(0,1,0);
SQR.V3.forward = new SQR.V3(0,0,1);

SQR.V3.__tv1 = new SQR.V3();
SQR.V3.__tv2 = new SQR.V3();
SQR.V3.__tv3 = new SQR.V3();

