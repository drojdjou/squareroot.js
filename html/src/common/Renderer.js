/**
 *	@class Renderer
 *	@memberof SQR
 *
 *	@description Represents the rendering engine
 */
SQR.Renderer = function(context) {

	var r = {};
	var uniforms = {}, renderObjects = [], transparentObjects = [];

	var updateTransform = function(t) {
		if(!t.active) return;

		t.transformWorld();
		
		if (t.numChildren > 0) {
            for (var i = 0; i < t.numChildren; i++) {
                updateTransform(t.children[i]);
            }
        }

        if(t.buffer && t.shader) {
        	if(t.transparent) transparentObjects.push(t);
        	else renderObjects.push(t);
        }
	}

	var lastBuffer, lastShader, shaderChanged, bufferChanged;

	var defOpts = {};

	r.render = function(root, camera, options) {
		var gl = SQR.gl;

		options = options || defOpts;

		if(!options.dontClear) context.clear();

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
				var p = (camera && camera.projection) || r.projection;
				if(!p) throw "> SQR.Renderer - no projection defined on camera and no default projection on renderer.";
				lastShader.setUniform('uProjection', p);
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