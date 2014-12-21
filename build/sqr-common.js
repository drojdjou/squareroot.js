/* --- --- [SQR.js] --- --- */

SQR = {

	// Global vars
	TWOPI: Math.PI * 2,
	HALFPI: Math.PI * 0.5,
	EPSILON: 1.0e-6,

	// Placeholder that holds current gl context. This is set in Context.create(), can be modified manually too
	gl: null, 
	// Placeholder that holdes a fullscreen geometry for post effects. Lazily created in PostEffect.js
	fullScreenQuad: null,
	//
	shaderPath: '.',

	// Namespaces
	Primitives: {},

	// Typical mesh layouts
	// Commonly used attribute names are: aPosition, aColor, aNormal, aUV, aUV2...
	v2u2: function() { return { aPosition: 2, aUV: 2 }; },
	v2c3: function() { return { aPosition: 2, aColor: 3 }; },
	v3n3: function() { return { aPosition: 3, aNormal: 3 }; },
	v3n3u2: function() { return { aPosition: 3, aNormal: 3, aUV: 2 }; },

	// GL contstants (removed, because this stuff can be accessed via SQR.gl)
	// POINTS          : 0x0000,
	// LINES           : 0x0001,
	// LINE_LOOP       : 0x0002,
	// LINE_STRIP      : 0x0003,
	// TRIANGLES       : 0x0004,
	// TRIANGLE_STRIP  : 0x0005,
	// TRIANGLE_FAN	   : 0x0006,

    // Error reporting 

    // Issues a console.warn() is user attempts to set a uniform that does not exist on the shader
    WARN_UNIFORM_NOT_PRESENT : false 

};

/* --- --- [Version.js] --- --- */

/** DO NOT EDIT. Updated from version.json **/
SQR.Version = {"version":"3","build":6,"date":"2014-12-21T02:41:16.155Z"}

/* --- --- [common/Buffer.js] --- --- */

SQR.Buffer = function() {

	var b = {};
	var hasIndex = false;
	var data, indices;
	var buffer, indexBuffer;

	b.mode = SQR.gl.TRIANGLES;

	b.setMode = function(m) {
		b.mode = m
		return b;
	}

	/**
	 *	Example layout: layout = { aPosition: 3, aColor: 4, aUV: 2 }
	 *	Can also use the constant functions from SQR - ex SQR.v2c3()
	 */
	b.layout = function(layout, size) {
		b.size = size;
		b.strideSize = 0;
		b.layout = layout;
		b.attributes = {};

		for(var a in layout) {
			var aa = { offset: b.strideSize, byteOffset: b.strideSize * 4, size: layout[a] };
			b.strideSize += layout[a];
			b.attributes[a] = aa;
		}

		b.strideByteSize = b.strideSize * 4;
		data = new Float32Array(size * b.strideSize);
		return b;
	}

	b.data = function(attribute, array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 1);
		}

		var s = b.attributes[attribute];
		var dl = array.length / s.size;

		for(var i = 0; i < dl; i++) {
			for(var j = 0; j < s.size; j++) {
				data[i * b.strideSize + j + s.offset] = array[i * s.size + j];
			}
		}

		return b;
	}

	b.set = function(attribute, position, array) {
		if(array.toArray) {
			array = array.toArray();
		} else if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 2);
		}

		var s = b.attributes[attribute];

		for(var j = 0; j < s.size; j++) {
			data[position * b.strideSize + j + s.offset] = array[j];
		}

		return b;
	}

	b.iterate = function(attribute, callback) {
		var s = b.attributes[attribute];
		var c = 0;

		for(var i = 0; i < data.length; i += b.strideSize) {
			callback(i + s.offset, data, c);
			c++;
		}
		return b;
	}

	b.bind = function() {
		SQR.gl.bindBuffer(SQR.gl.ARRAY_BUFFER, buffer);
		return b;
	}

	b.update = function() {
		var gl = SQR.gl;

		buffer = buffer || gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        if(hasIndex) {
        	indexBuffer = gl.createBuffer();
        	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        return b;
	}

	b.index = function(array) {

		if(!(array instanceof Array)) {
			array = Array.prototype.slice.call(arguments, 0);
		}

		indices = new Uint16Array(array);
		b.indexSize = array.length;
        hasIndex = true;

        return b;
	}

	b.isIndexed = function() {
		return hasIndex;
	}

	b.draw = function() {
		var gl = SQR.gl;

		if(hasIndex)
			gl.drawElements(b.mode, b.indexSize, gl.UNSIGNED_SHORT, 0);
		else 
			gl.drawArrays(b.mode, 0, b.size);
	}

	b.setRawData = function(array, offset) {
		data.set(array, offset);
	}

	b.getDataArray = function() {
		return data;
	}

	b.destroy  = function() {
		SQR.gl.deleteBuffer(buffer);
		if(hasIndex) SQR.gl.deleteBuffer(indexBuffer);
	}

	return b;

}

/* --- --- [common/Context.js] --- --- */

/**
 *	When creating the Context object, a canvas element or a selector (ex. #gl-canvas) 
 *	can be passed to this function. If omitted a new canvas element will be created
 *	and it will be available as the .canvas property of the object 
 *	returned by the SQR.Context functio.
 */
SQR.Context = function(canvas) {

	var NOGL = "> SQR.Context - Webgl is not supported.";

	if(!canvas) canvas = document.createElement('canvas');
	if(!(canvas instanceof HTMLElement)) canvas = document.querySelector(canvas);

	var c = { canvas: canvas }, gl;

	/**
	 *	Creates the webgl context. 
	 *	Options as defined in Specs, section 5.2 
	 *	(https://www.khronos.org/registry/webgl/specs/latest/1.0/#5.2)
	 *	Passing the options is not mandatory, if uses default values otherwise.
	 *
	 *	onError - specify a fallback funcion in case WebGL is not supported
	 *	if ommited, this function will throw a error if there are problems.
	 */
	c.create = function(options, onError) {

		onError = onError || function() { throw NOGL; };

		options = options || {};
		if(options.antialias === undefined) options.antialias = true;

		if(!window.WebGLRenderingContext) onError()

		try {
			gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
	    } catch(e) { 
	    	console.error(e);
	    	onError();
	    } 

		c.gl = gl;
        c.setAsCurrent();
		return c;
	}

	/** 
	 *	Sets the canvas and the viewport size to the given values.
	 */
	c.size = function(w, h) {
		canvas.width = w;
		canvas.height = h;
		gl.viewport(0, 0, w, h);
		return c;
	}

	/**
	 *	Define clear color. 
	 *	r, g, b, a are in [0-1] range.
	 */
	c.clearColor = function(r, g, b, a) {
		gl.clearColor(r, g, b, a);
		return c;
	}

	/**
	 *	Quick viewport clear function - clears both color and depth buffers.
	 *	Typically called at each frame before rendering to screen.
	 *	For custom clearing options use SQR.gl.clear()
	 */
	c.clear = function() {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		return c;
	}

	/**
	 *	Sets this context as current in the global SQR.gl variable.
	 *	This variable is used by the engine to perform rendering.
	 */
	c.setAsCurrent = function() {
		SQR.gl = gl;
		return c;
	}

	return c;
}

/* --- --- [common/FrameBuffer.js] --- --- */

/**
    Creates a new FrameBuffer

    @class A FrameBuffer is used in render-to-texture, image effects and other advances rendering schemes.

    @params width The width of the frame buffer

    @params height The width of the frame buffer
 */
SQR.FrameBuffer = function(width, height, resolution) {

    resolution = resolution || 1;

    
    
    var f = {}, gl = SQR.gl;

    f.fbo = gl.createFramebuffer();
    f.texture = gl.createTexture();
    f.depthBuffer = gl.createRenderbuffer();

    // bind fbo
    gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);

    // bind & setup texture
    gl.bindTexture(gl.TEXTURE_2D, f.texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    // bind render buffer
    gl.bindRenderbuffer(gl.RENDERBUFFER, f.depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    // attach texture and render buffer to fbo
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, f.texture, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, f.depthBuffer);

    // unbind all
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    f.bind = function() {
        gl.viewport(0, 0, width, height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
    }

    f.resize = function(w, h) {
        width = (w * resolution) | 0;
        height = (h * resolution) | 0;

        gl.bindFramebuffer(gl.FRAMEBUFFER, f.fbo);
        gl.bindTexture(gl.TEXTURE_2D, f.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        gl.bindRenderbuffer(gl.RENDERBUFFER, f.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
    }

    return f;
}


/* --- --- [common/Loader.js] --- --- */

/**
 *	Utility to load different types of files 
 *	(and also some WebRTC related stuff, see below)
 */
SQR.Loader = {

	/** 
	 *	Load a text file and return it's contents in the callback.
	 */
	loadText: function(path, callback){
		var request = new XMLHttpRequest();
		request.open("GET", path);

		var onReadystatechange = function(){
			if (request.readyState == 4) {
				request.removeEventListener('readystatechange', onReadystatechange);
				callback(request.responseText, path);
			}
		}

		request.addEventListener('readystatechange', onReadystatechange);

		request.send();
	},

	/** 
	 *	Load a JSON file and return it's contents in the callback.
	 *	This function will parse the JSON data for you and return an Object.
	 */
	loadJSON: function(path, callback){
		SQR.Loader.loadText(path, function(text) {
			callback(JSON.parse(text), path);
		});
	},

	/** 
	 *	Load an image file and return it's contents in the callback
	 *	as Image object.
	 */
	loadImage: function(path, callback){
		var img = new Image();
		if(callback) {
			var onload = function() {
				img.removeEventListener('load', onload);
				callback(img, path);
			}
			img.addEventListener('load', onload);
		}
		img.src = path;
		return img;
	},

	/** 
	 *	Initiate user stream (webcam). 
	 */
	loadWebcam: function(callback, options) {
		navigator.getUserMedia  = navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia;

        if(!navigator.getUserMedia) {
        	console.error('> SQR.Loader - getUserMedia not supported');
        	callback();
        }

        options = options || {
        	audio: false,
	        video: {
	        	// mandatory: { minWidth: 1920, minHeight: 1080 }
	        }
	    };

	    var onVideo = function(stream) {
	    	video.stream = stream;
			video.src = window.URL.createObjectURL(stream);
	        video.play();
	        video.addEventListener('canplaythrough', videoReady, false);
	    }

	    var videoReady = function() {
	    	callback(video, 'webcam');
	    }

        var video = document.createElement('video');
    	video.autoplay = true;

		navigator.getUserMedia(options, onVideo, function(e) { 
			console.error('> SQR.Loader - getUserMedia error ', e);
		});
    },

    /**
     *	Preload a video so that it can be used as a texture (typically)
     */
    loadVideo: function(path, callback) {
    	var videoReady = function() {
	    	callback(video, path);
	    }

    	var video = document.createElement('video');
    	video.autoplay = true;
    	video.addEventListener('canplaythrough', videoReady, false);


    	var p = path;

    	if(!video.canPlayType('video/mp4')) {
    		p = p.replace('mp4', 'webm');
    	}

    	video.src = p;
    },

    /**
     *	Load multiple assets of type:
     *
     *	- text, including GLSL code
     *	- JSON, including model, geometry, scene. etc..
     *	- image (jpg, gif, png), video (mp4, webm)
     *	- webcam (it will initiate the webcam, 
     *			  ask user for permisions, and return a ready to use stream)
     */
	loadAssets: function(paths, callback, progressCallback) {
		var toLoad = paths.length;
		SQR.Loader.assets = {};
		var aliases = {};

		var onAsset = function(asset, p) {
			SQR.Loader.assets[aliases[p] || p] = asset;
			toLoad--;

			if(progressCallback) {
				progressCallback(toLoad, paths.length);
			}

			if(toLoad == 0) {
				callback(SQR.Loader.assets);
			}
		}
		
		for(var i = 0; i < toLoad; i++) {
			var p = paths[i];

			if(typeof(p) != 'string') {
				aliases[p[0]] = p[1];
				p = p[0];
			}

			var e = p.substring(p.lastIndexOf('.') + 1);

			if(p.indexOf('~') > -1) {
				if(SQR.GLSL && SQR.GLSL[p.substring(2)]) {
					toLoad--;
					continue;
				} else {
					p = p.replace('~', SQR.shaderPath);
				}
			}
			
			switch(e) {
				case 'glsl':
					SQR.Loader.loadText(p, onAsset);
					break;
				case 'png':
				case 'jpg':
				case 'gif':
					SQR.Loader.loadImage(p, onAsset);
					break;
				case 'json':
				case 'js':
					SQR.Loader.loadJSON(p, onAsset);
					break;
				case 'mp4':
				case 'webm':
					SQR.Loader.loadVideo(p, onAsset);
					break;
				case 'webcam':
					SQR.Loader.loadWebcam(onAsset);
					break;
			}
		}
	}
};








/* --- --- [common/PostEffect.js] --- --- */

SQR.PostEffect = function(shaderSource) {
    SQR.fullScreenQuad = SQR.fullScreenQuad || SQR.Buffer()
        .layout(SQR.v2u2(), 6)
        .data('aPosition', -1, 1,   1, 1,   1, -1,   -1, 1,   1, -1,   -1, -1)
        .data('aUV',        0, 1,   1, 1,   1,  0,    0, 1,   1,  0,    0,  0)
        .update();

    var pe = new SQR.Transform();
    pe.buffer = SQR.fullScreenQuad;
    pe.shader = SQR.Shader(shaderSource);

    return pe;
}

/* --- --- [common/Renderer.js] --- --- */

SQR.Renderer = function(context) {

	var r = {};
	var uniforms = {}, renderObjects = [];

	var updateTransform = function(t) {
		if(!t.active) return;

		t.transformWorld();
		
		if (t.numChildren > 0) {
            for (var i = 0; i < t.numChildren; i++) {
                updateTransform(t.children[i]);
            }
        }

        if(t.buffer && t.shader) {
        	renderObjects.push(t);
        }
	}

	var lastBuffer, lastShader, shaderChanged, bufferChanged;

	r.render = function(root, camera, options) {
		var gl = SQR.gl;

		if(!options || !options.dontClear) context.clear();

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);

		renderObjects.length = 0;
		updateTransform(root);

		if(camera) {
			camera.computeInverseMatrix();
		}

		var objectsToRender = renderObjects.length, ro, lastBuffer = null, lastShader = null;
		

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use();
		}

		for(var i = 0; i < objectsToRender; i++) {

			shaderChanged = false, bufferChanged = false;

			var ro = renderObjects[i];

			if(lastBuffer != ro.buffer) {
				lastBuffer = ro.buffer;
				lastBuffer.bind();
				bufferChanged = true;
			}

			if((lastShader != ro.shader) && !hasReplacementShader) {
				lastShader = ro.shader.use().updateTextures();
				lastShader.setUniform('uProjection', r.projection);
				shaderChanged = true;
			}

			if(shaderChanged || bufferChanged) {
				lastShader.attribPointers(lastBuffer);
			}
			

			ro.transformView(camera ? camera.inverseWorldMatrix : null);
			ro.draw(options);
		}

	}

	r.renderToScreen = function() {
		var gl = SQR.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	return r;

}

/* --- --- [common/Shader.js] --- --- */

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

	        if(u.type == gl.SAMPLER_2D) {
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
		var gl = SQR.gl, id = uniform.id;
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

/* --- --- [common/Texture.js] --- --- */

SQR.Texture = function(s, options) {

    options = options || {};

	var t = {};
	var gl = SQR.gl;
	var source = s;
	var texture = gl.createTexture();

	t.isAnimated = (options && options.isAnimated) || (s instanceof HTMLVideoElement);

	var isPowerOfTwo = function() {
        var x = source.width, y = source.height;
        return x > 0 && y > 0 && (x & (x - 1)) == 0 && (y & (y - 1)) == 0;
    }

	t.update = function() {
		var gl = SQR.gl;
		// gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        // gl.bindTexture(gl.TEXTURE_2D, null);
        return t;
	}

    var wrapS = options.wrapS || options.wrap || gl.CLAMP_TO_EDGE;
    var wrapT = options.wrapT || options.wrap || gl.CLAMP_TO_EDGE;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    if(isPowerOfTwo()) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.bindTexture(gl.TEXTURE_2D, null);

    t.tex = texture;

	return t;

}

/* --- --- [common/Transform.js] --- --- */

// https://raw.githubusercontent.com/drojdjou/squareroot.js/gl/src/core/Transform.js
SQR.Transform = function() {

	var t = {};

	var inverseWorldMatrix;

    t.name = 'sqr.transform.' + SQR.TransformCount++;
    t.active = true;

	t.position = new SQR.V3();
    t.globalPosition = new SQR.V3();
	t.quaternion = new SQR.Quaternion();
	t.rotation = new SQR.V3();
	t.scale = new SQR.V3(1, 1, 1);
	t.useQuaternion = false;

    t.isStatic = false;
    t.directMatrixMode = false;
    var transformState = 0;

	t.matrix = new SQR.Matrix44();
	t.normalMatrix = new SQR.Matrix33();
	t.globalMatrix = new SQR.Matrix44();
    t.viewMatrix = new SQR.Matrix44();
    t.inverseWorldMatrix;

	t.children = [], t.numChildren = 0;

   /**
     * Add a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform}
     *
     * It doesn't do any sort of type checking so if you add non object that are not {SQR.Transforms}
     * it will result in errors when the scene is rendered.
     */
    t.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            var c = arguments[i];
            c.parent = t;
            if (t.children.indexOf(c) == -1) t.children.push(c);
        }
        t.numChildren = t.children.length;
        return t;
    }

    /**
     * Remove a child transform. Accepts multiple arguments but all of them need to be of type {SQR.Transform}
     */
    t.remove = function() {
        for (var i = 0; i < arguments.length; i++) {
            var c = arguments[i];
            var j = t.children.indexOf(c);
            if (j == -1) return false;
            c.parent = null;
            t.children.splice(j, 1);
        }
        t.numChildren = t.children.length;
        return t;
    }

    t.removeAll = function() {
        t.children.length = 0;
        t.numChildren = 0;
    }

    /**
     * Check if transform is child of this transfom
     * @param t the {SQR.Transfom} to look for
     */
    t.contains = function(c) {
        return t.children.indexOf(c) > -1;
    }

    /**
     * Execute this function on all the child transforms including this current one
     * @param f the function that will be called on each child. This function will receive the transform as argument.
     */
    t.recurse = function(f, excludeSelf) {
       if(!excludeSelf) f(t);
        for (var i = 0; i < t.numChildren; i++) {
            t.children[i].recurse(f);
        }
    }

    t.draw = function(options) {
        var isReplacementShader = options && options.replacementShader;
        var shader = isReplacementShader ? options.replacementShader : t.shader;

        shader.setUniform('uMatrix', t.globalMatrix);
        shader.setUniform('uViewMatrix', t.viewMatrix);
        shader.setUniform('uNormalMatrix', t.normalMatrix);

        if(!isReplacementShader && shader.uniforms) {
            var un = Object.keys(shader.uniforms);
            for(var i = 0, l = un.length; i < l; i++) {
                shader.setUniform(un[i], shader.uniforms[un[i]]);
            }
        }

        if(!isReplacementShader && t.uniforms) {
            var un = Object.keys(t.uniforms);
            for(var i = 0, l = un.length; i < l; i++) {
                shader.setUniform(un[i], t.uniforms[un[i]]);
            }
        }

    	t.buffer.draw();
    }

	/**
     * Sets up the local matrix and multiplies is by the parents globalMatrix.
     * This function is called in the rendering process, do not call directly.
     *
     * @private
     */
    t.transformWorld = function() {

        if(transformState == 1) return;

        if(!t.directMatrixMode) {
        	var p = t.position;
            var s = t.scale;
            
            if (t.useQuaternion) {
                var q = t.quaternion;
            	t.matrix.setTQS(p.x, p.y, p.z, q.w, q.x, q.y, q.z, s.x, s.y, s.z);
           	} else {
                var r = t.rotation;
    			t.matrix.setTRS(p.x, p.y, p.z, r.x, r.y, r.z, s.x, s.y, s.z);
            }
        }

        if (t.parent) {
            t.parent.globalMatrix.copyTo(t.globalMatrix);
            t.globalMatrix.multiply(t.matrix);
        } else {
            t.matrix.copyTo(t.globalMatrix);
        }

        t.globalMatrix.extractPosition(t.globalPosition);

        if(t.isStatic) transformState = 1;
    }

    /**
     * Calculate the view matrix.
     *
     * This function is called in the rendering process, do not call directly.
     *
     * @param inverseCamMatrix {SQR.Matrix44} the inverse matrix of the camera
     */
    t.transformView = function(inverseCamMatrix) {
        if(inverseCamMatrix) {
            inverseCamMatrix.copyTo(t.viewMatrix);
            t.viewMatrix.multiply(t.globalMatrix);
            t.viewMatrix.inverseMat3(t.normalMatrix);
        } else {
            t.globalMatrix.copyTo(t.viewMatrix);
            t.viewMatrix.inverseMat3(t.normalMatrix);
        }
        
    }

	/**
     * Calculate the camera inverse matrix.
     *
     * Used only if this transform is a camera.
     *
     * This function is called in the rendering process, do not call directly.
     */
    t.computeInverseMatrix = function() {
    	if(!t.inverseWorldMatrix) {
            t.inverseWorldMatrix = new SQR.Matrix44();
        }
        t.globalMatrix.inverse(t.inverseWorldMatrix);
        return t.inverseWorldMatrix;
    }

	return t;

}

SQR.TransformCount = 0;

