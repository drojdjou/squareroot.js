SQR.WebGL = function(gl, shader) {

	var that = this;

	
	var initialized = false;

	this.renderMode = gl.TRIANGLES;
	this.usage = gl.STATIC_DRAW;

	// this.renderMode = gl.LINES;
	// this.usage = gl.DYNAMIC_DRAW;

	this.u = {};

	var setAttributeData = function(geo) {
	    var attr, val;
	    
		for(var i = 0; i < shader.numAttributes; i++) {
			attr = shader.attributes[i];
			if(!attr.buffer) attr.buffer = gl.createBuffer();
			val = geo[attr.name] || builtInAttribute(attr.name, geo);
			gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, val, that.usage);
		}

		geo.dirty = false;
	}

	var setupAttributes = function(geo) {
		var attr;

		for(var i = 0; i < shader.numAttributes; i++) {
			attr = shader.attributes[i];
			gl.bindBuffer(gl.ARRAY_BUFFER, attr.buffer);
	        gl.vertexAttribPointer(attr.location, geo.vertexSize, gl.FLOAT, false, 0, 0);
		}
	}

	var builtInAttribute = function(name, geo) {
		switch(name) {
			case 'aVertexPosition':
				return geo.vertices;
				break;
			case 'aVertexNormal':
				return geo.normals;
				break;
			default:
				return false;
		}
	}

	var setUniforms = function(transform, uniforms) {
		var uni, val;

		for(var i = 0; i < shader.numUniforms; i++) {
			uni = shader.uniforms[i];
			val = that.u[uni.name] || builtInUniform(uni.name, transform, uniforms);
			if(val) shader.setUniform(uni, val);
		}
	}

	var builtInUniform = function(name, transform, uniforms) {
		switch(name) {
			case 'uMatrix':
				return transform.globalMatrix.data;
			case 'uProjection':
				return uniforms.projection.data;
			case 'uViewMatrix':
				return uniforms.viewMatrix.data;
			case 'uNormalMatrix':
				return transform.normalMatrix.data;
			case 'uConcatMatrix':
				return concatMatrix.data;
			default:
				return false;
		}
	}

	var concatMatrix = new SQR.Matrix44();
	
	this.draw = function(transform, uniforms) {
		if(!shader.isReady()) return;

		if(uniforms.projection) uniforms.projection.copyTo(concatMatrix);
		else concatMatrix.identity();

        if(uniforms.viewMatrix) concatMatrix.multiply(uniforms.viewMatrix);
        if(transform.globalMatrix) concatMatrix.multiply(transform.globalMatrix);

        // Don't bother rendering if object out of the screen 
        // (TODO: check if this works ok for any option)
        if(concatMatrix.data[14] < -1) {
        	return;
        }

		var geo = transform.geometry;

		SQR.GL.useProgram(shader.program);

		if(SQR.GL.isNewGeometry(geo) || geo.dirty) {
			setAttributeData(geo);
			setupAttributes(geo);
		}

		setUniforms(transform, uniforms);

		gl.drawArrays(this.renderMode, 0, geo.numVertices);
	}

}









