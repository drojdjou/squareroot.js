SQR.Shader = function(source, options) {

	var s = {}, program, gl;
	var attributes = {}, attrList = [];
	var uniforms = {}, uniformList = [], uniformTextures = [];

	var parseGLSL = function(s) {

		if(!s) throw "> SQR.Shader.parseGLSL - Shader source code missing";

		var vertex = "", fragment = "";
		var isVertex = true;

		var ls = s.split("\n");

		for(var i = 0; i < ls.length; i++) {
			var l = ls[i];

			if (l.indexOf("//#include") > -1) {
				var p = l.substring(11), inc;

				if(SQR.GLSL && SQR.GLSL[p.substring(1)]) {
					inc = SQR.GLSL[p.substring(1)];
				} else {
					inc = SQR.Loader.assets[p.replace('~', SQR.shaderPath)];
				}

				if(!inc) throw "> SQR.Shader.parseGLSL - Include not found " + p;
				ls[i] = inc;
			}
		}

		var ls = ls.join('\n').split('\n');

		for(var i = 0; i < ls.length; i++) {
			var l = ls[i];
			if(l.indexOf("//#") > -1) {
				if (l.indexOf("//#fragment") > -1) {
					isVertex = false;
				} else if (l.indexOf("//#vertex") > -1) {
					isVertex = true;
				}  
			} else {
				if(l.indexOf("//") > -1) l = l.substring(0, l.indexOf("//"));

				if(l.match(/^([\s\t]*)$/)) continue;

				if(isVertex) {
					vertex += l + "\n";
				} else {
					fragment += l + "\n";
				}
			}
		}

		return { vertex: vertex, fragment: fragment };
	};

	s.compile = function() {
		var sc = source = parseGLSL(source);
		var gl = SQR.gl;
		var vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, sc.vertex);
        gl.compileShader(vs);
         
        var fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, sc.fragment);
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
		var gl = SQR.gl;
	    var numAttr = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

	    for (var i = 0; i < numAttr; i++) {
	        var a = gl.getActiveAttrib(program, i);
	        a.location = gl.getAttribLocation(program, a.name);
	        attributes[a.name] = a;
	        attrList.push(a);
	    }

	    var numUni = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS), id = 0;

	    for (var i = 0; i < numUni; i++) {
	        var u = gl.getActiveUniform(program, i);
	        u.location = gl.getUniformLocation(program, u.name);

	        if(u.type == gl.SAMPLER_2D || u.type == gl.SAMPLER_CUBE) {
	        	u.texId = id++;
	        	uniformTextures.push(u);
	        }

	        uniforms[u.name] = u;
	        uniformList.push(u);
	    }

	    return s;
	}

	var stringType = 'string';

	s.getUniform = function(name) {
		return uniforms[name];
	}

	s.hasUniform = function(name) {
		return uniforms[name] != null;
	}

	s.setUniform = function(uniform, value) {
		var gl = SQR.gl;
		var n = (typeof uniform == stringType) ? uniforms[uniform] : uniform;
		var v = value;

		if(!n) {
			if(SQR.WARN_UNIFORM_NOT_PRESENT) {
				console.warn("> SQR.Shader attempt to set uniform that does not exist: " + uniform);
				console.trace();
			}
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
			case gl.FLOAT_MAT2:
				gl.uniformMatrix2fv(n.location, false, v.data || v);
				break;
			case gl.FLOAT_MAT3:
				gl.uniformMatrix3fv(n.location, false, v.data || v);
				break;
			case gl.FLOAT_MAT4:
				gl.uniformMatrix4fv(n.location, false, v.data || v);
				break;
			case gl.SAMPLER_2D:
				setTexture(n, v);
				break;
			case gl.SAMPLER_CUBE:
				setTextureCube(n, v);
				break;
			default:
				console.warn("> SQR.Shader > WARNING! Unknown uniform type ( 0x" + n.type.toString(16) + " )");
				break;
		}

		return s;
	}

	var setTexture = function(uniform, texture) {
		var gl = SQR.gl, id = uniform.texId;
		uniform.texref = texture;
	    gl.activeTexture(gl.TEXTURE0 + id); // 33984
		gl.bindTexture(gl.TEXTURE_2D, texture.tex || texture);
		if(texture.isAnimated) texture.update();
		gl.uniform1i(uniform.location, id);
	}

	var setTextureCube = function(uniform, texture) {
		var gl = SQR.gl, id = uniform.texId;
		uniform.texref = texture;
	    gl.activeTexture(gl.TEXTURE0 + id);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture.tex || texture);
		gl.uniform1i(uniform.location, id);
	}

	s.updateTextures = function() {
		var gl = SQR.gl;
		for(var i = 0, tl = uniformTextures.length; i < tl; i++) {
			var t = uniformTextures[i];
			if(t.texref) s.setUniform(t, t.texref);
		}
		return s;
	}

	s.use = function() {
		SQR.gl.useProgram(program);
		return s;
	}

	s.attribPointers = function(geo) {
		var gl = SQR.gl, al = attrList.length;
		geo = geo.buffer || geo;
		for(var i = 0; i < al; i++) {
			var a = attrList[i];
		 	var ga = geo.attributes[a.name];
		 	if(!ga) throw "> SQR.Shader expects attribute " + a.name + " but geometry doesn't provide it";
		 	if(!a.enabled) gl.enableVertexAttribArray(a.location);
			gl.vertexAttribPointer(a.location, ga.size, gl.FLOAT, false, geo.strideByteSize, ga.byteOffset);
			a.enabled = true;
		}
		return s;
	}


	if(!options || !options.doNotCompile) {
		s.compile();
		s.inspect();
	}

	return s;

}