/**
 *	@class Renderer
 *	@memberof SQR
 *
 *	@description Represents the rendering engine
 */
SQR.Renderer = function(context) {

	var r = {
		currentTime: 0
	};
	
	var uniforms = {}, renderObjects = [], transparentObjects = [];
	var startTime, time, deltaTime;

	var updateTransform = function(t) {
		if(!t.active) return;

		t.transformWorld();

		if(t.clip) t.clip.update(t, time, deltaTime);
		
		if (t.numChildren > 0) {
			for (var i = 0; i < t.numChildren; i++) {
				updateTransform(t.children[i]);
			}
		}

		if(t.transparent) transparentObjects.push(t);
		else if(!t.useDepth) renderObjects.unshift(t);
		else renderObjects.push(t);
	}

	var lastBuffer, lastShader, shaderChanged, bufferChanged;

	var defOpts = {};

	r.autoClear = true;

	var setCameraUniforms = function(camera, lastShader) {
		if(camera) lastShader.setUniform('uEyePosition', camera.globalPosition);

		var p = (camera && camera.projection) ? camera.projection : r.projection;

		if(p) {
			lastShader
				.setUniform('uProjection', p)
				.setUniform('uNear', p.near)
				.setUniform('uFar', p.far);
		}

		lastShader.setUniform('uTime', time);
	}

	r.render = function(root, camera, options) {
		var gl = SQR.gl;

		if(!startTime) startTime = new Date().getTime();
		time = new Date().getTime() - startTime;
		deltaTime = time - (r.currentTime || 0);
		r.currentTime = time;

		options = options || defOpts;

		if(r.autoClear) context.clear();

		gl.enable(gl.DEPTH_TEST);
		gl.disable(gl.STENCIL_TEST);
		gl.frontFace(gl.CW);
		
		if(options.customGLSetup) {
			options.customGLSetup(gl);
		}

		if(!options.drawAgain) {
			renderObjects.length = 0;
			transparentObjects.length = 0;
			updateTransform(root);
			if(camera) camera.computeInverseMatrix();
			renderObjects = renderObjects.concat(transparentObjects);
		}

		var objectsToRender = renderObjects.length, ro, 
			lastBuffer = null, 
			lastShader = null,
			transparentRendering = false;
		

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use().updateTextures();
			setCameraUniforms(camera, lastShader);
		}

		for(var i = 0; i < objectsToRender; i++) {

			shaderChanged = false, bufferChanged = false;

			var ro = renderObjects[i];

			if(!options.drawAgain) ro.transformView(camera ? camera.inverseWorldMatrix : null);

			if(!ro.buffer) continue;

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
				setCameraUniforms(camera, lastShader);
				shaderChanged = true;
			}

			if(shaderChanged || bufferChanged) {
				lastShader.attribPointers(lastBuffer);
			}

			ro.draw(options);
		}

		gl.disable(gl.BLEND);
	}

	r.renderToScreen = function() {
		var gl = SQR.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	return r;

}