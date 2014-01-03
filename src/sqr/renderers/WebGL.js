SQR.WebGL = function(gl, shader) {

	var vbuffer = gl.createBuffer();
	var initialized = false;

	this.renderMode = gl.TRIANGLES;

	var initAttributes = function() {
		shader.program.aVertexPosition = gl.getAttribLocation(shader.program, "aVertexPosition");
    	gl.enableVertexAttribArray(shader.program.aVertexPosition);
	}

	var initUniforms = function(uniforms) {
		gl.uniform4fv(shader.program.uColor, [1.0, 0.0, 0.0, 1.0]);
		gl.uniformMatrix4fv(shader.program.uProjection, false, uniforms.projection.data);
	}
	

	this.draw = function(transform, uniforms) {
		if(!shader.isReady()) return;

		SQR.GL.useProgram(shader.program);

		if(!initialized) {
			initAttributes();
			initUniforms(uniforms);
			initialized = true;
		}

		gl.uniformMatrix4fv(shader.program.uMatrix, false, transform.globalMatrix.data);

		var geo = transform.geometry;

        if(SQR.GL.currentVBuffer != vbuffer) {
			gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW);
	        gl.vertexAttribPointer(shader.program.aVertexPosition, geo.vertexSize, gl.FLOAT, false, 0, 0);
	        SQR.GL.currentVBuffer = vbuffer;
	    }

        gl.drawArrays(this.renderMode, 0, geo.numVertices);
	}

}