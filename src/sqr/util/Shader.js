SQR.Shader = function(gl) {

	var that = this;

	this.program = null;
	this.u = {};

	this.compile = function(vertex, fragment) {
		var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
         
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
        gl.compileShader(fs);
         
        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(vs));
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) console.error("SHADER COMPILE ERROR", gl.getShaderInfoLog(fs));
        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS)) console.error("SHADER LINKING ERROR", gl.getProgramInfoLog(this.program));
	}

	this.inspect = function() {
		// var tid = 0;
		var p = that.program;

	    that.uniforms = [];
	    that.attributes = [];

	    var numUni = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
	    var numAttr = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);

	    var id = 1;

	    for (var i = 0; i < numUni; i++) {
	        var u = gl.getActiveUniform(p, i);
	        u.location = gl.getUniformLocation(p, u.name);

	        if(u.type == gl.SAMPLER_2D) {
	        	u.texId = id++;
	        }

	        that.uniforms.push(u);
	    }

	    
	    for (var i = 0; i < numAttr; i++) {
	        var a = gl.getActiveAttrib(p, i);
	        a.location = gl.getAttribLocation(p, a.name);
	        gl.enableVertexAttribArray(a.location);
	        that.attributes.push(a);
	    }

	    that.numUniforms = numUni;
	    that.numAttributes = numAttr;
	}

	this.isReady = function() {
		return this.program !== null;
	}

	this.load = function(src, callback) {
		SQR.Loader.loadShader(src, function(vertex, fragment) {
	        that.compile(vertex, fragment);
	        that.inspect();
	        if(callback) callback(that.program);
		});
	}

	this.setUniform = function(uniform, value) {
		var n = uniform;
		var v = value;

		if(v.toUniform) v = v.toUniform(n.type);

		switch (n.type) {
			case gl.BYTE:
				gl.uniform1i(n.location, v);
				break;
			case gl.UNSIGNED_BYTE:
				gl.uniform1i(n.location, v);
				break;
			case gl.SHORT:
				gl.uniform1i(n.location, v);
				break;
			case gl.UNSIGNED_SHORT:
				gl.uniform1i(n.location, v);
				break;
			case gl.INT:
				gl.uniform1i(n.location, v);
				break;
			case gl.INT_VEC2:
				gl.uniform2iv(n.location, v);
				break;
			case gl.INT_VEC3:
				gl.uniform3iv(n.location, v);
				break;
			case gl.INT_VEC4:
				gl.uniform4iv(n.location, v);
				break;
			case gl.UNSIGNED_INT:
				gl.uniform1i(n.location, v);
				break;
			case gl.FLOAT:
				gl.uniform1f(n.location, v);
				break;
			case gl.FLOAT_VEC2:
				gl.uniform2fv(n.location, v);
				break;
			case gl.FLOAT_VEC3:
				gl.uniform3fv(n.location, v);
				break;
			case gl.FLOAT_VEC4:
				gl.uniform4fv(n.location, v);
				break;
			case gl.BOOL:
				gl.uniform1i(n.location, v);
				break;
			case gl.BOOL_VEC2:
				gl.uniform2iv(n.location, v);
				break;
			case gl.BOOL_VEC3:
				gl.uniform3iv(n.location, v);
				break;
			case gl.BOOL_VEC4:
				gl.uniform4iv(n.location, v);
				break;
			// TODO: Test matrices
			case gl.FLOAT_MAT2:
				gl.uniformMatrix2fv(n.location, false, v);
				break;
			case gl.FLOAT_MAT3:
				gl.uniformMatrix3fv(n.location, false, v);
				break;
			case gl.FLOAT_MAT4:
				gl.uniformMatrix4fv(n.location, false, v);
				break;
			case gl.SAMPLER_2D:
				setTexture(n.location, v, n.texId);
				break;
			case gl.SAMPLER_CUBE:
				setTextureCube(n.location, v, n.texId);
				break;
			default:
				return "WARNING! Unknown uniform type ( 0x" + n.type.toString(16) + " )";
		}
	}

	var setTexture = function(location, texture, id) {
		id = id || 1;
	    gl.activeTexture(33984 + id);
	    if(texture.update) texture.update();
	    if(texture.tex) texture = texture.tex;
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.uniform1i(location, id);
	}

	var setTextureCube = function(location, texture, id) {
		id = id || 1;
	    gl.activeTexture(33984 + id);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.tex);
		gl.uniform1i(location, id);
	}
}








