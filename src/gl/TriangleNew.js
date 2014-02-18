SQR.TriangleNew = function(vertices, ia, ib, ic) {

	this.size = 3;

	var normal = new SQR.V3();

	this.toBuffer = function(buffer, index) {
		var s = vertices[ia].size;
		vertices[ia].toBuffer(buffer, index);
		vertices[ib].toBuffer(buffer, index+s);
		vertices[ic].toBuffer(buffer, index+s*2);
	}

	this.calculateNormal = function() {
        // if(options.perVertextNormals)

        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;
        var c = SQR.VectorUtil.__tv3;

        var vs = vertices;

        a.sub(vs[ib].position, vs[ia].position);
        b.sub(vs[ic].position, vs[ia].position);
        normal.cross(a, b).norm();

        vertices[ia].add(SQR.Vertex.NORMAL, normal);
        vertices[ib].add(SQR.Vertex.NORMAL, normal);
        vertices[ic].add(SQR.Vertex.NORMAL, normal);
    }

}