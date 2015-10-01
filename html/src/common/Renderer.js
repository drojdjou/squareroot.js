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

	r.render = function(root, camera, options) {
		var gl = SQR.gl;

		if(!startTime) startTime = new Date().getTime();
		time = new Date().getTime() - startTime;
		deltaTime = time - (r.currentTime || 0);
		r.currentTime = time;

		options = options || defOpts;

		if(!options.dontClear && r.autoClear) {
			context.clear();
		}

		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CW);

		renderObjects.length = 0;
		transparentObjects.length = 0;
		
		updateTransform(root);

		if(camera) {
			camera.computeInverseMatrix();
		}

		renderObjects = renderObjects.concat(transparentObjects);

		var objectsToRender = renderObjects.length, ro, 
			lastBuffer = null, 
			lastShader = null,
			transparentRendering = false;
		

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use();
		}

		for(var i = 0; i < objectsToRender; i++) {

			shaderChanged = false, bufferChanged = false;

			var ro = renderObjects[i];

			ro.transformView(camera ? camera.inverseWorldMatrix : null);

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

				if(camera) lastShader.setUniform('uEyePosition', camera.globalPosition);

				var p = (camera && camera.projection) ? camera.projection : r.projection;
				if(p) lastShader.setUniform('uProjection', p);

				lastShader.setUniform('uTime', time);

				shaderChanged = true;
			}

			if(shaderChanged || bufferChanged) {
				lastShader.attribPointers(lastBuffer);
			}

			ro.draw(options);
		}

	}

	r.renderToScreen = function() {
		var gl = SQR.gl;
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	return r;

}