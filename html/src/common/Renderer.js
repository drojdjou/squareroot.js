/**
 *	@class Renderer
 *	@memberof SQR
 *
 *	@description Represents the rendering engine
 */
SQR.Renderer = function(c, options, onError) {

	var context;

	context = c && c.setAsCurrent ? c : SQR.Context(c, options, onError);

	var r = {
		currentTime: 0,
		deltaTime: 0,
		autoClear: true,
		context: context
	};
	
	var renderObjects = [], transparentObjects = [];
	var startTime, time;

	var updateTransform = function(t, camera, options) {

		if(!t.active) return;

		if(!t.__transformed) {
			t.transformWorld();
			t.__transformed = false;
		} 

		t.transformView(camera ? camera.inverseWorldMatrix : null);

		if(t.clip) t.clip.update(t, time, r.deltaTime);
		if(options.pointer3d) options.pointer3d.onTransform(t);
		
		if (t.numChildren > 0) {
			for (var i = 0; i < t.numChildren; i++) {
				updateTransform(t.children[i], camera, options);
			}
		}

		if(t.buffer && t.shader) {
			if(t.transparent) transparentObjects.push(t);
			else renderObjects.push(t);
		}
		
	}

	var lastBuffer, lastShader, shaderChanged, bufferChanged;
	var defOpts = {};
	var camrig = [];

	var setCommonUniforms = function(camera, lastShader) {
		if(camera) lastShader.setUniform('uEyePosition', camera.globalPosition);

		var p = (camera && camera.projection) ? camera.projection : r.projection;
		if(p) lastShader.setUniform('uProjection', p).setUniform('uNear', p.near).setUniform('uFar', p.far);

		lastShader.setUniform('uTime', time);
	}

	r.clearColor = function(c, g, b, a) {
		// c is a SQR.Color and we can ignore the rest
		if(c.r != null) {
			if(c.a == undefined) c.a = 1;
			context.gl.clearColor(c.r, c.g, c.b, c.a);
		} else {
			if(a == undefined) a = 1;
			context.gl.clearColor(c, g, b, a);
		}

		context.gl.clear(SQR.gl.COLOR_BUFFER_BIT);
		return r;
	}

	r.render = function(root, camera, options) {
		context.setAsCurrent();
		r.tick();
		r.beforeDraw(camera, options);
		r.update(root, camera, options);
		r.draw(null, camera, options);
		r.afterDraw(options);
	}


	r.tick = function() {
		if(!startTime) startTime = new Date().getTime();
		time = new Date().getTime() - startTime;
		r.deltaTime = time - r.currentTime;
		r.currentTime = time;
		return r;
	}

	r.beforeDraw = function(camera, options) {
		options = options || defOpts;
		if(options.pointer3d) {
			var p = (camera && camera.projection) ? camera.projection : r.projection;
			options.pointer3d.fromMousePosition(camera || root, p);
		}
		return r;
	}

	r.update = function(root, camera, options) {
		options = options || defOpts;

		renderObjects.length = 0;
		transparentObjects.length = 0;
		camrig.length = 0;

		if(camera) {

			var a = camera;
			while(a) {
				camrig.unshift(a);
				a = a.parent;
			}

			for(var i = 0, l = camrig.length; i < l; i++) {
				camrig[i].transformWorld();
				camrig[i].__transformed = true;
			};

			camera.computeInverseMatrix();
		}

		updateTransform(root, camera, options);
		return r;
	}	

	r.draw = function(root, camera, options) {
		var gl = SQR.gl;
		if(!gl) return;
		options = options || defOpts;

		if(r.autoClear) context.clear();

		gl.enable(gl.DEPTH_TEST);
		gl.depthMask(true);
		gl.disable(gl.STENCIL_TEST);
		gl.frontFace(gl.CW);
		
		if(options.customGLSetup) {
			options.customGLSetup(gl);
		}

		if(root && root.buffer && root.shader) {
			renderObjects.push(root);
		}

		renderObjects = renderObjects.concat(transparentObjects);

		var objectsToRender = renderObjects.length, ro, 
			lastBuffer = null, 
			lastShader = null,
			transparentRendering = false;
		

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use().updateTextures();
			setCommonUniforms(camera, lastShader);
		}

		for(var i = 0; i < objectsToRender; i++) {

			shaderChanged = false, bufferChanged = false;

			var ro = renderObjects[i];

			if(ro.transparent) {
				if(!transparentRendering) {
					gl.enable(gl.BLEND);
					transparentRendering = true;
				}
				gl.blendFunc(ro.srcFactor, ro.dstFactor);
			}

			if(lastBuffer != ro.buffer) {
				lastBuffer = ro.buffer;
				lastBuffer.bind();
				bufferChanged = true;
			}

			if((lastShader != ro.shader) && !hasReplacementShader) {
				lastShader = ro.shader.use().updateTextures();
				setCommonUniforms(camera, lastShader);
				shaderChanged = true;
			}

			if(shaderChanged || bufferChanged) {
				lastShader.attribPointers(lastBuffer);
			}

			ro.draw(options);
		}

		gl.disable(gl.BLEND);
		return r;
	}

	r.afterDraw = function(options) {
		options = options || defOpts;
		if(options.pointer3d) options.pointer3d.onAfterRender();
		return r;
	}


	r.renderToScreen = function() {
		var gl = SQR.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	// Default the clear color to black 
	r.clearColor(0, 0, 0, 1);

	return r;

}