/**
 *	@class Shader
 *	@memberof SQR
 *
 *	@description Represents a GLSL shader. The shader class takes the source GLSL code,
 *	compiles it and extracts all the attributes and uniforms. It also exposes
 *	methods to set the uniform values of this shader.
 *
 *	Please read the {@tutorial basic-setup} tutorial to see how to use a shader  
 *	and the {@tutorial understanding-shaders} tutorial for an in depth discussion on shaders.
 *
 *
 *	@param {string} source - the GLSL source code formatted 
 *	in a way to include both vertex and fragment shaders.
 *
 *	@param {object} options - additional options, not required. Supported options in the code sample below.
 *
 *	@example
{
	// Do not compile 
	// (yes, there is such option, but 99.99% of the time this is not necessary)
	doNotCompile: true,

	// Preprocesor directives. 
	// This object will create 
	// the following directives, attached to both
	// vertex and fragment shaders:
	// #define COLOR_ONLY
	// #define COLOR 1.0 0.0 0.0
	directives: [
	    { name: 'COLOR_ONLY' },
	    { name: 'COLOR', value: '1.0, 0.0, 0.0' }
	]
}
 */
SQR.Shader = function(source, options) {

	var s = {}, program, gl;
	var attributes = {}, attrList = [];
	var uniforms = {}, uniformList = [], uniformTextures = [];

	var parseGLSL = function(s) {

		if(!s) throw "> SQR.Shader.parseGLSL - Shader source code missing";

		s = s.replace(/\r/g, "");

		var pp = "", pv = options ? options.directives : null;

		if(pv && pv instanceof Array) {
			for(var i = 0; i < pv.length; i++) {
				pp += "#define " + pv[i].name;
				if(pv[i].value) pp += " " + pv[i].value;
				pp += "\n";
			}
		} 

		var vertex = pp, fragment = pp;
		var isVertex = true;

		var ls = s.split("\n");

		for(var i = 0; i < ls.length; i++) {
			var l = ls[i];

			if (l.indexOf("//#include") > -1) {
				var p = l.substring(11), inc;

				if(SQR.GLSL && SQR.GLSL[p]) {
					inc = SQR.GLSL[p];
				} else if(SQR.GLSLInclude && SQR.GLSLInclude[p]) {
					inc = SQR.GLSLInclude[p];
				} else if(options && options.includes) {
					inc = options.includes[p];
				}

				if(!inc) throw "> SQR.Shader.parseGLSL - Include not found: " + p;
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
		var sc = parseGLSL(source);
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
	        

	        if(u.type == gl.SAMPLER_2D || u.type == gl.SAMPLER_CUBE) {
	        	u.texId = id++;
	        	uniformTextures.push(u);
	        }

	        // Special case for arrays
	        if(u.name.indexOf('[') > -1) {
	        	var n = u.name.substring(0, u.name.indexOf('['));

	        	for(var j = 1; j < u.size; j++) {
	        		var ni = n + '[' + j + ']';
	        		var ui = {
	        			name: ni,
	        			location: gl.getUniformLocation(program, ni),
	        			type: u.type
	        		}

	        		uniforms[ui.name] = ui;
	        		uniformList.push(ui);
	        	}
	        }

	        u.location = gl.getUniformLocation(program, u.name);

	        uniforms[u.name] = u;
	        uniformList.push(u);
	    }

	    return s;
	}

	var stringType = 'string';

	s.getUniform = function(name) {
		return uniforms[name];
	}

	/**
	 *	@method hasUniform
	 *	@memberof SQR.Shader.prototype
	 *
	 *	@returns {Object} true if the shader has a uniform that has this name, null otherwise. The object returned has 3 properties: name, location, type.	
	 */
	s.hasUniform = function(name) {
		return uniforms[name] != null;
	}

	/**
	 *	@method setUniform
	 *	@memberof SQR.Shader.prototype
	 *
	 *	@description using setUniform is recommended for uniforms that do not change much or unifors that have the same
	 *	value for all the objects rendered with this shader. If you need to as uniforms that are different per object 
	 *	(ex. a 100 balls rendered with the same shader, but each with a different color) then it is better to use the 
	 *	<code>uniforms</code> object attached to each instance od <code>SQR.Transform</code>. 
	 *	Please refer to the {@tutorial understanding-shaders} for more info.
	 *
	 *	@param {string} uniform The name of the uniform. 
	 *	By convection all uniforms in SQR start with a lowercas u and the a capitalized/camelcase name follows.
	 *	Example of good uniform names: <code>uIntensity, uLightColor</code>. Not good: <code>uintensity, color</code>.
	 *
	 *	@param value the value of the uniform to set. It will expect a different object depending on the type of the uniform, 
	 *	but there are a few rules as shown in the example below.
	 *
	 *	@example
var sh = SQR.Shader(glslCodeString); 
// glslCodeString = the code loaded from a file or wherever you get it from

// ALWAYS DO THIS FIRST!
sh.use();

// for floats/ints just a number is ok
sh.setUniform('uSpeed', 2); 

// ... but a one element array will do too
sh.setUniform('uIntensity', [0.2]); 

// for vectors, regular Array or Float32Array is ok
sh.setUniform('uDirection', [0.2, 0.5, 0.3]);

// for matrices, pass in the data property of any Matrix class
sh.setUniform('uBoneMatrix', boneMatrix.data);

// textures expect an instance of SQR.Texture or SQR.Cubemap
sh.setUniform('uNormalMap', SQR.Texture('assets/normalMap.jpg'));

// in all the above cases any object that has a method called 'toUniform' works too
// SQR.V2, SQR.V3 and SQR.Color have that, so:
sh.setUniform('uCenter', new SQR.V3(12, 45, 33));
sh.setUniform('uColor', SQR.Color().fromHex('#ff8000'));

// or, assuming that light is an SQR.Transform:
sh.setUniform('uLighPosition', light.position)

	 */
	s.setUniform = function(uniform, value) {
		var gl = SQR.gl;
		var n = (typeof uniform == stringType) ? uniforms[uniform] : uniform;
		var v = value;

		if(!n) {

			var f = uniforms[uniform + '[0]'];

			if(f) {
				for(var i = 0; i < f.size; i++) {
					if(value[i]) s.setUniform(uniform + '[' + i + ']', value[i]);
				}
				return;
			}

			if(SQR.WARN_UNIFORM_NOT_PRESENT) {
				console.warn("> SQR.Shader attempt to set uniform that does not exist: " + uniform);
				console.trace();
			}
			return s;
		}

		if(v && v.toUniform) v = v.toUniform(n.type);

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

	    if(texture) {
			gl.bindTexture(gl.TEXTURE_2D, texture.tex || texture);
			if(texture.isAnimated) texture.update();
		} else {
			gl.bindTexture(gl.TEXTURE_2D, null);
		}

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

	/**
	 *	@method use
	 *	@memberof SQR.Shader.prototype
	 *
	 *	@description Sets this shader as the current program in GL. This function needs to be called before any uniforms are set.
	 */
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