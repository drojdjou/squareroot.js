SQR.VRPost = function(camera, renderer, ctx, options) {

	var width, height, halfWidth;

	var fbo, post;

	var isStereo = options.vrInput || options.debug || options.forceStereo;

	renderer.autoClear = false;

	var left = new SQR.Transform();
	var right = new SQR.Transform();

	left.position.x =  options.vrData.leftEyeX  || -0.1;
	right.position.x = options.vrData.rightEyeX || 0.1;

	if(options.isTouch || options.vrInput) camera.useQuaternion = true;
	camera.add(left, right);

	if(options.customShader) {
		fbo = SQR.FrameBuffer(0, 0);    
	    post = SQR.Primitives.createPostEffect(options.customShader);
		
	    post.uniforms = {
	    	scale: 			new SQR.V2(0.81, 0.81),
			scaleIn: 		new SQR.V2(1.0, 1.0),
			lensCenter: 	new SQR.V2(0.0, 0.0),
			hmdWarpParam: 	[1.0, 0.11, 0.12, 0.0],
			chromAbParam: 	[0.996, -0.004, 1.014, 0.0]
	    };
	}
	
	var p = {

		size: function() {
			var pr = window.devicePixelRatio;

			width = window.innerWidth * pr; 
			height = window.innerHeight * pr;
			halfWidth = width / 2;

			ctx.size(window.innerWidth, window.innerHeight, pr);

			if(options.customShader) fbo.resize(halfWidth, height);

			var aspect = width / height;
			var halfAspect = (width * 0.5) / height;

			var p = new SQR.ProjectionMatrix().perspective(isStereo ? 75 : 50, isStereo ? halfAspect : aspect, 0.01, 10000);
			camera.projection = p;
			left.projection = p;
			right.projection = p;
		},

		render: function(root) {

			if(options.vrInput) {
				var state = options.vrInput.getState();

				if(state.orientation !== null) {
					camera.quaternion.copyFrom(state.orientation);
				}

				if(state.position !== null) {
					camera.position.copyFrom(state.position);
				}

			} else if(options.isTouch && SQR.Gyro.hasGyro()) {

				camera.quaternion.copyFrom(SQR.Gyro.getOrientation());

			} else if(options.customCameraAnimation) {

				options.customCameraAnimation();

			}

			ctx.viewport(0, 0, width, height);
			ctx.clear();

			if(isStereo) {

				ctx.viewport(0, 0, halfWidth, height);
				renderer.render(root, left);

				ctx.viewport(halfWidth, 0, halfWidth, height);
				renderer.render(root, right);

			// } else if(options.isTouch) {

				//

				// 	fbo.bind();
				// 	ctx.clear();
				// 	renderer.render(root, left);
				// 	renderer.renderToScreen();
				// 	ctx.viewport(0, 0, halfWidth, height);
				// 	post.shader.use().setUniform('uTexture', fbo.texture);
				// 	renderer.render(post);

				// 	fbo.bind();
				// 	ctx.clear();
				// 	renderer.render(root, right);
				// 	renderer.renderToScreen();
				// 	ctx.viewport(halfWidth, 0, halfWidth, height);
				// 	post.shader.use().setUniform('uTexture', fbo.texture);
				// 	renderer.render(post);

			} else {

				renderer.render(root, camera);
			}
		}
	};

	return p;

}