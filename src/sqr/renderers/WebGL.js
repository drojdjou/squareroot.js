SQR.WebGL = function(gl, defaultShader) {

	var that = this;
	var initialized = false;
	var replacementShader = null;
	var concatMatrix = new SQR.Matrix44();

	this.renderMode = gl.TRIANGLES;
	this.usage = gl.STATIC_DRAW;
	this.transparent = false;
	this.srcFactor = null;
	this.dstFactor = null;
	this.depthTest = true;

	this.u = {};

	var __tmp_buf;

	var setAttributeData = function(geo, shader) {
		geo.setupBuffers(gl, shader, that.usage);

		if(geo.elements) {
			shader.elementBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shader.elementBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geo.elements, that.usage);
		}

		geo.dirty = false;
	}

	var setUniforms = function(transform, uniforms, shader) {
		var uni, val;

		for(var i = 0; i < shader.numUniforms; i++) {
			uni = shader.uniforms[i];
			val = shader.u[uni.name] || that.u[uni.name] || builtInUniform(uni.name, transform, uniforms);
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

	

	this.draw = function(transform, uniforms) {
		var geo = transform.geometry;
		var shader = uniforms.replacementShader || defaultShader;

		if(!shader.isReady() || !geo.count) return;

		if(uniforms.projection) uniforms.projection.copyTo(concatMatrix);
		else concatMatrix.identity();

        if(uniforms.viewMatrix) concatMatrix.multiply(uniforms.viewMatrix);
        if(transform.globalMatrix) concatMatrix.multiply(transform.globalMatrix);

		var np = SQR.GL.useProgram(shader.program);

		if(np || SQR.GL.isNewGeometry(geo) || geo.dirty) {
			setAttributeData(geo, shader);
		}

		setUniforms(transform, uniforms, shader);

		if(this.renderMode == gl.LINES) gl.lineWidth(this.lineWidth || 1);

		if(geo.elements) {
			// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, shader.elementBuffer); // Prob not needed
        	gl.drawElements(this.renderMode, geo.elements.length, gl.UNSIGNED_SHORT, 0);
		} else {
			gl.drawArrays(this.renderMode, 0, geo.count);
		}
	}

}









