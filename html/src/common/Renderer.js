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

	r.render = function(root, camera, options) {
		var gl = SQR.gl;
		context.clear();

		gl.enable(gl.DEPTH_TEST);

		renderObjects.length = 0;
		updateTransform(root);

		if(camera) {
			camera.computeInverseMatrix();
		}

		var objectsToRender = renderObjects.length, ro;
		var lastBuffer, lastShader;

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use();
		}

		for(var i = 0; i < objectsToRender; i++) {

			var ro = renderObjects[i];

			if((!lastShader || lastShader != ro.shader) && !hasReplacementShader) {
				lastShader = ro.shader.use().updateTextures();
				lastShader.setUniform('uProjection', r.projection);
				if(lastBuffer) lastShader.attribPointers(lastBuffer);
			}

			if(!lastBuffer || lastBuffer != ro.buffer) {
				lastBuffer = ro.buffer;
				lastBuffer.bind();
				if(lastShader) lastShader.attribPointers(lastBuffer);
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