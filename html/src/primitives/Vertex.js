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