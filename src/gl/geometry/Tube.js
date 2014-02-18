/**
 *
 */

SQR.Tube = function() {

	var that = this;
	var inner = 10, 
		outer = 20, 
		innerHeight = 10, 
		outerHeight = 10, 
		resolution = 12;

	var ringTO = [], ringTI = [], ringBO = [], ringBI = [];
	var faces = [];

	var deformFunc, twistFunc;
	var smooth = false;

	var ALMOST_ZERO = 0.0001;

	this.vertexSize = 3;

	this.inner = function(v) {
		inner = v;
		// For some reasone when it's 0 there are artifacts :)
		if(inner == 0) inner = ALMOST_ZERO;
		return this;
	}

	this.outer = function(v) {
		outer = v;
		return this;
	}

	this.height = function(i, o) {
		innerHeight = i;
		outerHeight = o || i;
		return this;
	}

	this.resolution = function(v) {
		resolution = v;
		return this;
	}

	this.setDeformation = function(f) {
		deformFunc = f;
		return this;
	}

	this.smooth = function(s) {
		smooth = s;
		return this;
	}

	this.setTwist = function(f) {
		twistFunc = f;
		return this;
	}

	this.refresh = function() {
		var i;

		ringTO.length = 0, ringTI.length = 0, ringBO.length = 0, ringBI.length = 0;
		faces.length = 0;

		var m = new SQR.Matrix44();

		for(i = 0; i < resolution; i++) {
			var rot = i / resolution * Math.PI * 2;

			

			var ih = innerHeight * 0.5;
			var oh = outerHeight * 0.5;

			if(deformFunc) {
				ih += deformFunc(rot, true);
				oh += deformFunc(rot, false);
			}

			var radius = (outer - inner) * 0.5;

			var v1 = new SQR.V3(radius,  0,  oh);
			var v2 = new SQR.V3(-radius,  0,  ih);
			var v3 = new SQR.V3(radius,  0, -oh);
			var v4 = new SQR.V3(-radius,  0,  -ih);

			m.identity();
			m.rotate(0, 0, rot);
			m.translate(inner + radius, 0, 0);

			if(twistFunc) {
				twistFunc(m, rot);
			}

			m.transformVector(v1);
			m.transformVector(v2);
			m.transformVector(v3);
			m.transformVector(v4);

			ringTO.push([v1, v1.clone()]);
			ringTI.push([v2, v2.clone()]);
			ringBO.push([v3, v3.clone()]);
			ringBI.push([v4, v4.clone()]);
		}

		for(i = 0; i < resolution; i++) {
			var n = i + 1;
			if(n == resolution) n = 0;

			var v1 = ringTO[i];
			var v2 = ringBO[i];

			var v3 = ringTO[n];
			var v4 = ringBO[n];

			var v5 = ringTI[i];
			var v6 = ringBI[i];

			var v7 = ringTI[n];
			var v8 = ringBI[n];

			// Outer side
			var t1 = new SQR.Triangle(v1[0], v2[0], v4[0]);
			var t2 = new SQR.Triangle(v1[0], v4[0], v3[0]);
			faces.push(new SQR.Quad(t1, t2));

			// Inner side
			if(inner > ALMOST_ZERO) {
				var t3 = new SQR.Triangle(v5[0], v8[0], v6[0]);
				var t4 = new SQR.Triangle(v5[0], v7[0], v8[0]);
				faces.push(new SQR.Quad(t3, t4));
			}

			// Top cap
			var t5 = new SQR.Triangle(v1[1], v3[1], v7[1]);
			var t6 = new SQR.Triangle(v1[1], v7[1], v5[1]);
			faces.push(new SQR.Quad(t5, t6));

			// Bottom cap
			var t7 = new SQR.Triangle(v2[1], v8[1], v4[1]);
			var t8 = new SQR.Triangle(v2[1], v6[1], v8[1]);
			faces.push(new SQR.Quad(t7, t8));
		}

		for(i = 0; i < faces.length; i++) {
			faces[i].calculateNormal(smooth);
		}

		var vs = [], ns = [];

		for(i = 0; i < faces.length; i++) {
			faces[i].toArray(vs, ns);
		}

		this.vertices = new Float32Array(vs);
		this.normals = new Float32Array(ns);
		this.numVertices = vs.length / this.vertexSize;

		this.dirty = true;

		return this;
	}

	// this.refresh();
}








