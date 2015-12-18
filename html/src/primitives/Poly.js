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
	var u = this.uvs;
	
	var tmp = v[1];
	v[1] = v[2];
	v[2] = tmp;

	if(u) {
		tmp = u[1];	
		u[1] = u[2];
		u[2] = tmp;
	}

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











