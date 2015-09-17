SQR.Tree = function(config) {

	var base = {
		end: config.start || new SQR.V3(),
		angle: 0,
		direction: 0
	};

	var flat = [];

	var mat = new SQR.Matrix44();
	var totalBranch = 0;

	var inRange = function(r) {
		if(r.length == 4) {
			var d = Math.random() > 0.5 ? 0 : 2;
			return r[0+d] + Math.random() * (r[1+d] - r[0+d]);
		} else if(r.length == 2) {
			return r[0] + Math.random() * (r[1] - r[0]);
		} else {
			return r;
		}
	}

	var interpolateByDepth = function(r, l) {
		if(r.length) return r[0] + (r[1] - r[0]) * (l / config.depth);
		else return r;
	}

	var createBranch = function(base, level) {

		var isTrunk = level == 0;
		var numBranches = isTrunk ? 1 : inRange(config.branches) | 0;

		for(var i = 0; i < numBranches; i++) {

			if(level > 0 && Math.random() > interpolateByDepth(config.branchProbability, level)) continue;

			var b = {
				parent: isTrunk ? null : base
			};

			b.start = base.end.clone();

			b.end = new SQR.V3();
			var lf = 1 * Math.pow(config.lengthDepthFactor, level);
			b.end.y = isTrunk ? inRange(config.trunkLength) : inRange(config.branchLength) * lf;


			b.direction = (i / numBranches) * SQR.TWOPI + ((level%2) * SQR.HALFPI) + config.branchDeviation * Math.random();
			b.angle = isTrunk ? 0 : inRange(config.branchAngle);
			// b.angle += base.angle;

			var af = 1 + level * config.angleDepthFactor;
			b.angle *= af;

			mat.setRotation(b.angle * Math.cos(b.direction), 0, b.angle * Math.sin(b.direction));
			mat.transformVector(b.end);
			b.end.add(b.start);

			var wsf = 1 * Math.pow(config.widthDepthFactor, level+0);
			b.widthStart = isTrunk ? config.baseWidth : config.branchWidth * wsf;

			var wef = 1 * Math.pow(config.widthDepthFactor, level+1);
			b.widthEnd = config.branchWidth * wef;

			flat.push(b);

			if(!base.children) base.children = [];
			base.children.push(b);

			totalBranch++;

			if(level <= config.depth) createBranch(b, level + 1);
		}

		
		
	}

	createBranch(base, 0);

	var toLineBuffer = function() {

		var buffer = SQR.Buffer()
			.layout({ aPosition: 3 }, totalBranch * 2)
			.setMode(SQR.gl.LINES);

		for(var i = 0; i < flat.length; i++) {
			var b = flat[i];
			buffer.set('aPosition', i*2+0, b.start);
			buffer.set('aPosition', i*2+1, b.end);
		}

		return buffer.update();

	}

	var toMesh = function() {
		var buffer = SQR.Buffer()
			.layout({ aPosition: 3, aNormal: 3 }, totalBranch * 2 * config.branchSides * 4)
			.setMode(SQR.gl.TRIANGLES);

		var V2 = SQR.Primitives.V2, V3 = SQR.Primitives.V3, F = SQR.Primitives.F();

		for(var i = 0; i < flat.length; i++) {
			var branch = flat[i];
			
			var bs = config.branchSides;
			for(var j = 0; j < bs; j++) {
				var sa = ((j+0)/bs) * SQR.TWOPI;
				var ea = ((j+1)/bs) * SQR.TWOPI;
				var sr = branch.widthStart;
				var er = branch.widthEnd;

				// a - b
				// | / |
				// c - d  
				var a = V3(Math.cos(sa) * sr, 0, Math.sin(sa) * sr);
				var b = V3(Math.cos(ea) * sr, 0, Math.sin(ea) * sr);
				var c = V3(Math.cos(ea) * er, 0, Math.sin(ea) * er);
				var d = V3(Math.cos(sa) * er, 0, Math.sin(sa) * er);

				if(branch.parent) {
					mat.setRotation(branch.parent.angle * Math.cos(branch.parent.direction), 0, branch.parent.angle * Math.sin(branch.parent.direction));
					mat.transformVector(b);
					mat.transformVector(a);
				}

				mat.setRotation(branch.angle * Math.cos(branch.direction), 0, branch.angle * Math.sin(branch.direction));
				mat.transformVector(c);
				mat.transformVector(d);

				a.add(branch.start);
				b.add(branch.start);

				c.add(branch.end);
				d.add(branch.end);

				F(c, d, b, a);
			}
		}

		F.toBuffer(buffer);

		return buffer.update();
	}

	return {
		base: base,
		flat: flat,
		toLineBuffer: toLineBuffer,
		toMesh: toMesh
	};

}