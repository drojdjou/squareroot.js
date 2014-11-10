SQR.Renderer = function(context) {

	var r = {}, gl;
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
		gl = SQR.gl;
		context.clear();

		gl.enable(gl.DEPTH_TEST);

		renderObjects.length = 0;
		updateTransform(root);

		if(camera) {
			uniforms.inverseCameraMatrix = camera.computeInverseMatrix();
			uniforms.projection = camera.projection;
		}

		var objectsToRender = renderObjects.length, r;
		var lastBuffer, lastShader;

		var hasReplacementShader = options && options.replacementShader;

		if(hasReplacementShader) {
			lastShader = options.replacementShader.use();
		}

		
		for(var i = 0; i < objectsToRender; i++) {

			r = renderObjects[i];

			if((!lastShader || lastShader != r.shader) && !hasReplacementShader) {
				lastShader = r.shader.use().updateTextures();
				if(camera) lastShader.setUniform('uProjection', camera.projection);
				if(lastBuffer) lastShader.attribPointers(lastBuffer);
			}

			if(!lastBuffer || lastBuffer != r.buffer) {
				lastBuffer = r.buffer;
				lastBuffer.bind();
				if(lastShader) lastShader.attribPointers(lastBuffer);
			}

			r.transformView(uniforms.inverseCameraMatrix);
			renderObjects[i].draw(uniforms, options);
		}

	}

	r.renderToScreen = function() {
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	}

	return r;

}