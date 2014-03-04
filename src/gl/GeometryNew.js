SQR.GeometryNew = function() {

	var that = this, data, dataSize, layout, buffer;

	this.vertices = [];
	this.faces = [];
	this.numVertices = 0;

	this.isReady = true;
	this.dirty = true;

	this.refresh = function() {
		if(that.faces.length > 0) refreshFaces();
		else refreshVertices();
		layout = that.vertices[0].layout;

		console.log("geo.refresh()");
	}

	this.setupBuffers = function(gl, shader, usage) {

		if(!data) that.refresh();

		buffer = buffer || gl.createBuffer();

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, usage);

		var l = layout.length;
		var s = that.vertices[0].size;
		var o = 0

		for(var i = 0; i < l; i++) {
			var le = layout[i];
			var attr = shader.attributes[layout[i].name];

			if(attr) {
				gl.enableVertexAttribArray(attr.location);
				gl.vertexAttribPointer(attr.location, le.size, gl.FLOAT, false, s * 4, o);
			}

			o += le.size * 4;
		}
	}

	var refreshFaces = function() {
		var fs = that.faces;
		var nv = fs.length;
		if(nv == 0) return;

		for(var i = 0; i < nv; i++) {
			fs[i].calculateNormal();
		}

		var sz = fs[0].size * that.vertices[0].size;

		var ds = nv * sz;

		if((dataSize > 0 && dataSize != ds) || !data) data = new Float32Array(ds);

		for(var i = 0; i < nv; i++) {
			fs[i].toBuffer(data, i * sz);
		}

		dataSize = ds;
		that.numVertices = nv * fs[0].size;
	}

	var refreshVertices = function() {
		var vs = that.vertices;
		var nv = vs.length;
		if(nv == 0) return;

		var sz = vs[0].size;

		var ds = nv * sz;

		if((dataSize > 0 && dataSize != ds) || !data) data = new Float32Array(ds);

		for(var i = 0; i < nv; i++) {
			vs[i].toBuffer(data, i * sz);
		}

		dataSize = ds;
		that.numVertices = nv;
	}
}