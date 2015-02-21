SQR.GL = function(gl, shader) {

	var vbuffer = gl.createBuffer();
	var initialized = false;

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

		if(SQR.GLState.currentProgram != shader.program) {
			gl.useProgram(shader.program);
			SQR.GLState.currentProgram = shader.program;
		}

		if(!initialized) {
			initAttributes();
			initUniforms(uniforms);
			initialized = true;
		}

		var geo = transform.geometry;

	    gl.uniformMatrix4fv(shader.program.uMatrix, false, transform.globalMatrix.data);

        if(SQR.GLState.currentVBuffer != vbuffer) {
			gl.bindBuffer(gl.ARRAY_BUFFER, vbuffer);
	        gl.bufferData(gl.ARRAY_BUFFER, geo.getVertices(), gl.STATIC_DRAW);
	        gl.vertexAttribPointer(shader.program.aVertexPosition, geo.vertexSize, gl.FLOAT, false, 0, 0);
	        SQR.GLState.currentVBuffer = vbuffer;
	    }

        
        gl.drawArrays(gl.TRIANGLES, 0, geo.numVertices);
	}

}