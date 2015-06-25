/**
 *  @class Spline
 *  @memberof SQR
 *
 *  @description Represents a spline composed of multiple cubic beziers
 */
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

		if(p.x !== undefined) {
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