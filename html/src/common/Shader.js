SQR.Shader = function(vertex, fragment) {

	var s = {}, program, gl;
	var attributes = {}, attrList = [];
	var uniforms = {}, uniformList = [];

	s.setGL = function(_gl) {
		gl = _gl;
		return s;
	}

	s.compile = function() {
		var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vertex);
        gl.compileShader(vs);
         
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, fragment);
        gl.compileShader(fs);
         
        program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) 
        	throw "> SQR.Shader. Vertex shader compile error: " + gl.getShaderInfoLog(vs);

        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) 
        	throw "> SQR.Shader. Fragment shader compile error: " + gl.getShaderInfoLog(fs);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)) 
        	throw "> SQR.Shader. Shader linking error: " + gl.getProgramInfoLog(program);

        return s;
	}

	s.inspect = function() {
	    var numAttr = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	    for (var i = 0; i < numAttr; i++) {
	        var a = gl.getActiveAttrib(program, i);
	        a.location = gl.getAttribLocation(program, a.name);
	        attributes[a.name] = a;
	        attrList.push(a);
	    }

	    var numUni = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS), id = 1;

	    for (var i = 0; i < numUni; i++) {
	        var u = gl.getActiveUniform(program, i);
	        u.location = gl.getUniformLocation(program, u.name);

	        if(u.type == gl.SAMPLER_2D) {
	        	u.texId = id++;
	        }

	        uniforms[u.name] = u;
	        uniformList.push(u);
	    }

	    return s;
	}

	s.setUniform = function(name, value) {
		var n = uniforms[name];
		var v = value;

		if(!n) {
			console.warn("> SQR.Shader attempt to set uniform that does not exist: " + name);
			return s;
		}

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
				console.warn("> SQR.Shader > WARNING! Unknown uniform type ( 0x" + n.type.toString(16) + " )");
				break;
		}

		return s;
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
	    if(texture.tex) texture = texture.tex;
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.tex);
		gl.uniform1i(location, id);
	}

	s.enableAttributes = function() {
		attrList.forEach(function(a) {
			gl.enableVertexAttribArray(a.location);
		});

		return s;
	}

	s.use = function() {
		gl.useProgram(program);
		return s;
	}

	s.attribPointers = function(geo) {
		attrList.forEach(function(a) {
		 	var ga = geo.attr(a.name);
		 	if(!ga) throw "> SQR.Shader expects attribute " + a.name + " but geometry doesn't provide it";
			gl.vertexAttribPointer(a.location, ga.size, gl.FLOAT, false, geo.stride(), ga.offset);
		});
		return s;
	}

	return s;

}