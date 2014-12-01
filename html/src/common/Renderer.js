SQR.Renderer = function(context) {

	var r = {};
	var uniforms = {}, renderObjects = [];

	var updateTransform = function(t) {
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